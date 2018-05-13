import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../model/usuario/usuario.model';
import { UsuarioService } from '../service/users/user.service';
import { UserRestMessage } from '../model/message/rest/user-rest.message';
import { DefaultRestMessageStatus } from '../model/message/rest/default-rest.message';
import { ToastrMensagem, ToastrBehavior } from '../behaviors/toastr.behavior';
import { InspetorModel } from '../model/inspetor/inspetor.model';
import { ProfileRestMessage } from '../model/message/rest/profile-rest.message';
import { PerfilUsuarioModel } from '../model/usuario/perfil-usuario.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  profiles: Array<PerfilUsuarioModel>;
  users: Array<InspetorModel>;
  user: InspetorModel;

  constructor(private toastr: ToastrBehavior, private service: UsuarioService) { }

  ngOnInit() {
    this.newUser();
    this.getAllUser();
    this.getAllProfiles();
  }

  private newUser() {
    this.user = new InspetorModel();
    this.user.user = new UsuarioModel();
  }

  private showToastrMessage(severity: string, shortMessage: string) {
    this.toastr.exibirMensagem(new ToastrMensagem(severity, shortMessage, null));
  }

  private showServerError() {
    this.showToastrMessage(ToastrMensagem.SEVERIDADE.ERROR, 'Erro de conexão com o servidor.');
  }

  private getAllUser() {
    this.service.get().subscribe((r: UserRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.users = r.users;
    }, err => {
      console.log(' -Exception: ', err);
      this.showServerError();
    });
  }

  private getAllProfiles() {
    this.service.getProfiles().subscribe((r: ProfileRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.profiles = r.profiles;
    }, err => {
      console.log(' -Exception: ', err);
      this.showServerError();
    });
  }

  private atualizar() {
    this.service.atualizar(this.user).subscribe((r: UserRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.onUserSelect(r.user);
      this.getAllUser();
    });
  }

  private salvarNovo() {
    this.service.salvar(this.user).subscribe((r: UserRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.onUserSelect(r.user);
      this.getAllUser();
    });
  }

  private validate(): boolean {
    let ok = true;

    if (!this.user.name) {
      return false;
    }

    if (!this.user.user.username) {
      return false;
    }

    if (!this.user.user.password) {
      return false;
    }

    if (!this.user.user.profile) {
      return false;
    }

    return ok;
  }

  onUserSelect(i: InspetorModel) {
    for (let p of this.profiles) {
      if (p.id === i.user.profile.id) {
        i.user.profile = p;
        break;
      }
    }
    this.user = i;
  }

  onNovoClick() {
    this.newUser();
  }

  onSalvarClick() {
    if (!this.validate()) {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Preencha todos os campos.');
    }

   if (this.user.id) {
     this.atualizar();
   } else {
     this.salvarNovo();
   }
  }

  onUsernameChange() {
    this.users.forEach(u => {
      if (u.user.username === this.user.user.username) {
        this.user.user.username = '';
        this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Nome de usuário não disponivel.');
      }
    });
  }

}
