import { Component, OnInit } from '@angular/core';
import { ProjetoModel } from '../model/projeto/projeto.model';
import { InspetorModel } from '../model/inspetor/inspetor.model';
import { ToastrBehavior, ToastrMensagem } from '../behaviors/toastr.behavior';
import { ProjectRestMessage } from '../model/message/rest/project-rest.message';
import { ProjetoService } from '../service/project/project.service';
import { GlobalsVar } from '../globals/globals';
import { DefaultRestMessageStatus } from '../model/message/rest/default-rest.message';
import { UsuarioService } from '../service/users/user.service';
import { UserRestMessage } from '../model/message/rest/user-rest.message';

@Component({
  selector: 'app-newproject',
  templateUrl: './newproject.component.html',
  styleUrls: ['./newproject.component.css']
})
export class NewprojectComponent implements OnInit {

  private inspector: InspetorModel;

  project = new ProjetoModel();
  projects: Array<ProjetoModel>;
  inspectors: Array<InspetorModel>;
  newParticipant: InspetorModel = null;

  constructor(private toastr: ToastrBehavior, private service: ProjetoService, private globals: GlobalsVar,
    private userService: UsuarioService) { }

  private showToastrMessage(severity: string, shortMessage: string) {
    this.toastr.exibirMensagem(new ToastrMensagem(severity, shortMessage, null));
  }

  private showServerError() {
    this.showToastrMessage(ToastrMensagem.SEVERIDADE.ERROR, 'Erro de conexão com o servidor.');
  }

  private newProject() {
    this.project = new ProjetoModel();
    this.project.owner = this.inspector;
    this.project.participants = new Array<InspetorModel>();
    this.newParticipant = null;
  }

  private getAllProjects() {
    this.service.getByInspectorId(this.globals.user.id).subscribe((r: ProjectRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.projects = r.projects;
    });
  }

  private getAllInspectors() {
    this.userService.get().subscribe((r: UserRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.inspectors = r.users;
    });
  }

  private getInspector() {
    this.userService.getInspectorByIdUser(this.globals.user.id).subscribe((r: UserRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.inspector = r.user;
      this.newProject();
    });
  }

  private validate(): boolean {
    let ok = true;

    if (!this.project.title) {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Informe um título.');

      return false;
    }

    if (!this.project.description) {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Insira a descrição.');

      return false;
    }

    if (this.project.participants.length === 0) {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Adicione ao menos um participante.');

      return false;
    }

    return ok;
  }

  private atualizar() {
    this.service.atualizar(this.project).subscribe((r: ProjectRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.project = r.project;
    });
  }

  private salvar() {
    this.service.salvar(this.project).subscribe((r: ProjectRestMessage) => {
      if (r.status !== DefaultRestMessageStatus.OK) {
        console.log(r);
        this.showServerError();

        return;
      }

      this.project = r.project;
      this.getAllProjects();
    });
  }

  ngOnInit() {
    this.getAllProjects();
    this.getAllInspectors();
    this.getInspector();
  }

  onNovoClick() {
    this.newProject();
  }

  onSalvarClick() {
    if (!this.validate()) {
      return;
    }

    if (this.project.id) {
      this.atualizar();
    } else {
      this.salvar();
    }
  }

  onTitleChange() {
    this.projects.forEach(p => {
      if (p.title === this.project.title) {
        this.project.title = '';
        this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Título de projeto não disponivel.');
      }
    });
  }

  onProjectSelect(p: ProjetoModel) {
    this.project = p;
    this.newParticipant = null;
  }

  onRemoveClick(p: InspetorModel) {
    let i = this.project.participants.indexOf(p);
    this.project.participants.splice(i, 1);
  }

  onNewParticipantClick() {
    if (this.project.owner.id === this.newParticipant.id) {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.WARNING, 'Inspetor chefe não pode ser participante..');
      this.newParticipant = null;
      return;
    }

    let ok = false;
    this.project.participants.forEach(p => {
      if (p.id === this.newParticipant.id) {
        ok = true;
        return;
      }
    });

    if (ok) {
      this.newParticipant = null;
      return;
    }

    this.project.participants.push(this.newParticipant);
    this.newParticipant = null;

  }

}
