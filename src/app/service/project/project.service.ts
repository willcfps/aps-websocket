import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { GlobalsVar } from '../../globals/globals';
import { ProjectRestMessage } from '../../model/message/rest/project-rest.message';
import { HttpHeaders } from '@angular/common/http';
import { ProjetoModel } from '../../model/projeto/projeto.model';

@Injectable()
export class ProjetoService {

    private resource = '/project';
    constructor(private globals: GlobalsVar, private http: HttpClient) {

    }

    findById(id: number) {
        let url = this.globals.apiUrl + this.resource + '?id=' + id;
        return this.http.get<ProjectRestMessage>(url);
    }

    getByInspectorId(id: number) {
        let url = this.globals.apiUrl + this.resource + '/owner?id=' + id;
        return this.http.get<ProjectRestMessage>(url);
    }

    salvar(project: ProjetoModel) {
        let url = this.globals.apiUrl + this.resource;
        return this.http.post<ProjectRestMessage>(url, project);
    }

    atualizar(project: ProjetoModel) {
        let url = this.globals.apiUrl + this.resource;
        return this.http.put<ProjectRestMessage>(url, project);
    }
}
