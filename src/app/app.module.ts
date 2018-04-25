import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StompService } from '../external/component/stomp.service';


import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
