import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { StompService } from '../../external/component/stomp.service';
import { DefaultMessageModel } from '../model/message/default.message.model';
import { RegisteredMessage } from '../model/message/registered.message';
import { VisualizedMessage } from '../model/message/visualized.message';
import { setInterval } from 'timers';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messagespanel') public panel: ElementRef;
  @ViewChild('sendcontainer') public sendContainer: ElementRef;

  private scrollerInterval: any;
  private automaticScroller = true;

  private name = 'William';
  private user = 'x1919';
  private discution = 'novo-topico';

  private topicSubscription: any;
  private confirmationSubscription: any;
  private registerSubscription: any;

  private participants = new Array<string>();
  private confirmations = new Map();

  messages = new Array<DefaultMessageModel>();
  message: DefaultMessageModel;

  position: DefaultMessageModel;

  constructor(private stomp: StompService) {

  }

  private disconnect() {
    this.stomp.disconnect().then(() => {
      console.log('Connection closed');
    });
  }

  private unsubscribe() {
    this.confirmationSubscription.unsubscribe();
    this.registerSubscription.unsubscribe();
    this.topicSubscription.unsubscribe();
  }

  private subscriber() {
    this.stomp.startConnect().then(() => {

      this.confirmationSubscription = this.stomp.subscribe('/confirmation/' + this.user, this.onConfirmationEvent.bind(this));
      this.registerSubscription = this.stomp.subscribe('/registered/' + this.discution, this.onRegisteredEvent.bind(this));
      this.topicSubscription = this.stomp.subscribe('/topic/' + this.discution, this.accept.bind(this));

      this.sendRegistration();

      this.stomp.done('topic');
    });
  }

  private connect() {
    this.stomp.configure({
      host: 'http://localhost:8080/aps-websocket',
      debug: false,
      queue: { 'topic': false }
    });
  }

  private sendConfirmation(data: DefaultMessageModel) {
    let aux = new VisualizedMessage();
    aux.messageId = data.id;
    aux.user = this.user;

    this.stomp.send('/app/confirm/' + data.from, aux);
  }

  private sendRegistration() {
    let aux = new RegisteredMessage();
    aux.user = this.user;

    this.stomp.send('/app/register/' + this.discution, aux);
  }

  public accept(data: DefaultMessageModel) {

    data.position = this.panel.nativeElement.scrollHeight - 5;
    this.messages.push(data);

    // if (data.from !== this.user) {
    this.sendConfirmation(data);
    // }

    if (this.messages.length === 10) {
      console.log('voltar aq: ', data);
      this.position = data;
    }

  }

  private onConfirmationEvent(message: VisualizedMessage) {
    this.messages.forEach(m => {
      if (m.id === message.messageId) {
        m.visualized = true;

        return;
      }
    });
  }

  private onRegisteredEvent(message: RegisteredMessage) {
    if (message.user === this.user) {
      return;
    }

    for (let p of this.participants) {
      if (p === message.user) {
        return;
      }
    }

    this.participants.push(message.user);
  }

  private newMessage() {
    this.message = new DefaultMessageModel();
    this.message.id = new Date().getTime().toString();
    this.message.from = this.user;
    this.message.name = this.name;
  }

  private send(body: DefaultMessageModel) {
    let date = new Date();
    body.dateTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    this.stomp.send('/app/' + this.discution, body);
  }

  ngOnDestroy() {
    clearInterval(this.scrollerInterval);
  }

  ngOnInit() {
    this.connect();
    this.subscriber();
    this.newMessage();

    this.scrollerInterval = setInterval(() => {
      if (this.automaticScroller) {
        this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollHeight;
      }
    }, 500);
  }

  onDisableScrollClick() {
    this.automaticScroller = !this.automaticScroller;
  }

  onBtnSendClick() {
    if (!this.message.message || !this.message.message.trim()) {
      return;
    }
    this.send(this.message);
    this.newMessage();
  }

  onEnterPress(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      this.onBtnSendClick();
      e.preventDefault();
    }
  }

  onResponseMessageClick(message: DefaultMessageModel) {
    this.message.response = message;
  }

  onResponseCancelClick() {
    this.message.response = null;
  }

  onFindMessageResponseClick(message: DefaultMessageModel) {
    console.log(this.sendContainer);

    for (let aux of this.panel.nativeElement.childNodes) {
      if (aux.id === message.id) {
        this.automaticScroller = false;
        aux.scrollIntoView();

        break;
      }
    }
  }
}
