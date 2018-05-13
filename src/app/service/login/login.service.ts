import { UsuarioModel } from '../../model/usuario/usuario.model';
import { DefaultRestMessage } from '../../model/message/rest/default-rest.message';
import { LoginRestMessage } from '../../model/message/rest/login-rest.message';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { GlobalsVar } from '../../globals/globals';

@Injectable()
export class LoginService {

    private resource = '/login';
    constructor(private globals: GlobalsVar, private http: HttpClient) {

    }

    login(user: UsuarioModel) {
        let url = this.globals.apiUrl + this.resource;
        return this.http.post<LoginRestMessage>(url, user);
    }
}
