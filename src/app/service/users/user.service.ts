import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../model/usuario/usuario.model';
import { GlobalsVar } from '../../globals/globals';
import { HttpClient } from '@angular/common/http';
import { UserRestMessage } from '../../model/message/rest/user-rest.message';
import { ProfileRestMessage } from '../../model/message/rest/profile-rest.message';
import { InspetorModel } from '../../model/inspetor/inspetor.model';

@Injectable()
export class UsuarioService {

    private resource = '/users';
    constructor(private globals: GlobalsVar, private http: HttpClient) {

    }

    salvar(u: InspetorModel) {
        let url = this.globals.apiUrl + this.resource;
        return this.http.post<UserRestMessage>(url, u);
    }

    atualizar(u: InspetorModel) {
        let url = this.globals.apiUrl + this.resource;
        return this.http.put<UserRestMessage>(url, u);
    }

    get(id?: string) {
        if (!id) {
            id = 'EMPTY';
        }

        let url = this.globals.apiUrl + this.resource + '?id=' + id;
        return this.http.get<UserRestMessage>(url);
    }

    getProfiles() {
        let url = this.globals.apiUrl + this.resource + '/profiles';
        return this.http.get<ProfileRestMessage>(url);
    }

    getInspectorByIdUser(id: number) {
        let url = this.globals.apiUrl + this.resource + '/user?id=' + id;
        return this.http.get<UserRestMessage>(url);
    }
}
