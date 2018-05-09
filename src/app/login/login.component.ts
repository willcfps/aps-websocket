import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario/usuario.model';
import { ToastrBehavior, ToastrMensagem } from '../behaviors/toastr.behavior';
import { Router } from '@angular/router';
import { GlobalsVar } from '../globals/globals';
import { LoginService } from '../service/login/login.service';
import { DefaultRestMessage, DefaultRestMessageStatus } from '../model/message/rest/default-rest.message';
import { LoginRestMessage } from '../model/message/rest/login-rest.message';
import { PerfilUsuarioModel } from '../model/usuario/perfil-usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new UsuarioModel();

  constructor(private toastr: ToastrBehavior, private route: Router, private globals: GlobalsVar, private service: LoginService) {

  }

  private showToastrMessage(severity: string, shortMessage: string) {
    this.toastr.exibirMensagem(new ToastrMensagem(severity, shortMessage, null));
  }

  private showUnauthorizedMessage() {
    this.showToastrMessage(ToastrMensagem.SEVERIDADE.INFO, 'Usuário e/ou senha inválido.');
  }

  private showServerError() {
    this.showToastrMessage(ToastrMensagem.SEVERIDADE.ERROR, 'Erro de conexão com o servidor.');
  }

  private autenticate() {
    this.service.login(this.user).subscribe((r: LoginRestMessage) => {
      if (r.status === DefaultRestMessageStatus.UNAUTHORIZED) {
        this.showUnauthorizedMessage();

        return;
      }
      this.globals.user = this.user;
      this.globals.session = r.shortMessage;
      this.globals.user.id = r.userId;
      this.globals.user.profile = new PerfilUsuarioModel();
      this.globals.user.profile.weight = r.profileWeight;
      this.globals.user.profile.id = r.profileId;
      this.globals.projects = r.projects;

      this.route.navigate(['/home']);
    }, error => {
      console.log(' -Exception: ', error);
      this.showServerError();
    });
  }

  ngOnInit() {
  }

  onLoginClick() {
    if (!(this.user.username && this.user.password)) {
      this.showUnauthorizedMessage();

      return;
    }

    this.autenticate();
  }

}
