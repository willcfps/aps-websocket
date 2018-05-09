import { Component, OnInit } from '@angular/core';
import { StompService } from '../external/component/stomp.service';
import { GlobalsVar } from './globals/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private globals: GlobalsVar, private route: Router) {

  }

  ngOnInit() {
    if (!this.globals.user) {
      this.route.navigate(['/']);
    }
  }
}
