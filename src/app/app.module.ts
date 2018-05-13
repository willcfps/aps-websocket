import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StompService } from '../external/component/stomp.service';


import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ToastrBehavior } from './behaviors/toastr.behavior';
import { GlobalsVar } from './globals/globals';
import { AppRoutingModule } from './app-routing.module';
import { RESTService } from './service/rest.service';
import { LoginService } from './service/login/login.service';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { NewprojectComponent } from './newproject/newproject.component';
import { ProjetoService } from './service/project/project.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/http.interceptor';
import { UsuarioService } from './service/users/user.service';



@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    LeftBarComponent,
    ChatComponent,
    HomeComponent,
    LoginComponent,
    ProjectComponent,
    UserComponent,
    NewprojectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    StompService,
    ToastrBehavior,
    GlobalsVar,
    { provide: RESTService, useClass: RESTService },
    LoginService,
    ProjetoService,
    UsuarioService
  ],
  bootstrap: [AppComponent],
  exports: [FormsModule]
})
export class AppModule { }
