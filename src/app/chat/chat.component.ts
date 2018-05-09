import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { StompService } from '../../external/component/stomp.service';
import { DefaultMessageModel } from '../model/message/default.message.model';
import { RegisteredMessage } from '../model/message/registered.message';
import { VisualizedMessage } from '../model/message/visualized.message';
import { GlobalsVar } from '../globals/globals';

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

  private topicSubscription: any;
  private confirmationSubscription: any;
  private registerSubscription: any;

  private participants = new Array<string>();
  private confirmations = new Map();
  private projectId_;

  messages = new Array<DefaultMessageModel>();
  message: DefaultMessageModel;
  user: string;

  @Input() set projectId(id: string) {
    this.projectId_ = id;
    this.messages = new Array<DefaultMessageModel>();

    clearInterval(this.scrollerInterval);

    this.unsubscribe();
    this.init();
  }

  constructor(private stomp: StompService, private globals: GlobalsVar) {
    this.user = this.globals.user.id.toString();
  }

  private init() {
    this.connect();
    this.subscriber();

    this.scrollerInterval = setInterval(() => {
      if (this.automaticScroller) {
        this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollHeight;
      }
    }, 500);
  }

  private generateHeader() {
    let header: any = new Object();
    header.authorization = this.globals.session;

    return header;
  }

  private disconnect() {
    if (!this.stomp || this.stomp.disconnect) {
      return;
    }
    this.stomp.disconnect().then(() => {
      console.log('Connection closed');
    });
  }

  private unsubscribe() {
    if (this.confirmationSubscription) {
      this.confirmationSubscription.unsubscribe();
    }

    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }

    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }

  private subscriber() {
    this.stomp.startConnect().then(() => {

      this.confirmationSubscription = this.stomp.subscribe('/confirmation/' + this.projectId_ + '/' + this.globals.user.id.toString(),
        this.onConfirmationEvent.bind(this),
        this.generateHeader());

      this.registerSubscription = this.stomp.subscribe('/registered/' + this.projectId_,
        this.onRegisteredEvent.bind(this),
        this.generateHeader());

      this.topicSubscription = this.stomp.subscribe('/topic/' + this.projectId_,
        this.accept.bind(this),
        this.generateHeader());

      this.sendRegistration();
      this.stomp.done('topic');
    });
  }

  private connect() {
    this.stomp.configure({
      host: 'http://192.168.0.102:8080/api/aps-websocket',
      headers: this.generateHeader(),
      debug: true,
      queue: { 'topic': false }
    });
  }

  private sendConfirmation(data: DefaultMessageModel) {
    let aux = new VisualizedMessage();
    aux.messageId = data.id;
    aux.user = this.globals.user.id.toString();

    this.stomp.send('/app/confirm/' + this.projectId_ + '/' + data.from, aux, this.generateHeader());
  }

  private sendRegistration() {
    let aux = new RegisteredMessage();
    aux.user = this.globals.user.username;

    this.stomp.send('/app/register/' + this.projectId_, aux, this.generateHeader());
  }

  public accept(data: DefaultMessageModel) {

    data.position = this.panel.nativeElement.scrollHeight - 5;
    this.messages.push(data);

    if (data.from !== this.globals.user.id.toString()) {
    this.sendConfirmation(data);
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
    if (message.user === this.globals.user.username) {
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
    this.message.from = this.globals.user.id.toString();
    this.message.name = this.globals.user.username;
  }

  private send(body: DefaultMessageModel) {
    let date = new Date();
    body.dateTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    this.stomp.send('/app/' + this.projectId_, body, this.generateHeader());
  }

  ngOnDestroy() {
    clearInterval(this.scrollerInterval);
    this.unsubscribe();
    this.disconnect();
  }

  ngOnInit() {
    this.newMessage();
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
