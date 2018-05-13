import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoModel } from '../model/projeto/projeto.model';
import { ProjetoService } from '../service/project/project.service';
import { ProjectRestMessage } from '../model/message/rest/project-rest.message';
import { ToastrMensagem, ToastrBehavior } from '../behaviors/toastr.behavior';
import { DefaultRestMessageStatus } from '../model/message/rest/default-rest.message';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  private project: ProjetoModel;
  private projectId: any;

  constructor(private toastr: ToastrBehavior, private route: ActivatedRoute,
    private router: Router, private service: ProjetoService) { }

    private showToastrMessage(severity: string, shortMessage: string) {
      this.toastr.exibirMensagem(new ToastrMensagem(severity, shortMessage, null));
    }

    private showServerError() {
      this.showToastrMessage(ToastrMensagem.SEVERIDADE.ERROR, 'Erro de conexão com o servidor.');
    }

  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      this.projectId = +params['id'] || null;
      this.service.findById(this.projectId).subscribe((r: ProjectRestMessage) => {
        if (r.status !== DefaultRestMessageStatus.OK) {
          console.log(r);
          this.showServerError();

          return;
        }

        this.project = r.project;
        console.log(this.project);
      }, error => {
      console.log(' -Exception: ', error);
      this.showServerError();
    });
    });
  }

}
