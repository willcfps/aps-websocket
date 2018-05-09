import { Http, Response, RequestOptions, Headers, BaseRequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { RESTService } from '../rest.service';
import { UsuarioModel } from '../../model/usuario/usuario.model';
import { Observable } from 'rxjs/Observable';
import { DefaultRestMessage } from '../../model/message/rest/default-rest.message';
import { LoginRestMessage } from '../../model/message/rest/login-rest.message';

@Injectable()
export class LoginService {

    private resource = '/login';
    constructor(private restService: RESTService) {

    }

    login(user: UsuarioModel): Observable<LoginRestMessage> {
        return this.restService.post(this.resource, user, null).map((r: Response) => {
            let aux = <LoginRestMessage>r.json();

            return aux;
        }).catch(RESTService.handleError);
    }
}
