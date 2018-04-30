import { Component } from '@angular/core';
import { StompService } from '../external/component/stomp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  helloResponse: any = 'Digite seu nome:';
  name: string;

  private subscription: any;

  constructor(private stomp: StompService) {
    this.init();
  }

  onSendClick() {
    this.send({ 'name': this.name });
  }

  private disconnect() {
    this.stomp.disconnect().then(() => {
      console.log('Connection closed');
    });
  }

  private unsubscribe() {
    this.subscription.unsubscribe();
  }

  private send(body: any) {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      const timestamp = 12;
      this.subscription = this.stomp.subscribe('/topic/greetings/' + timestamp, this.response.bind(this));
      this.stomp.send('/app/hello/' + timestamp, body);
    });
  }

  private init() {
    this.stomp.configure({
      host: 'http://localhost:8080/gs-guide-websocket',
      debug: true,
      queue: { 'init': false }
    });
  }

  public response(data) {
    this.helloResponse = data.content;
    this.unsubscribe();

    console.log('websocket response: ', data);
  }
}
