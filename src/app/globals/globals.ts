import { Injectable } from '@angular/core';
import { UsuarioModel, ProjetosInscritos } from '../model/usuario/usuario.model';

@Injectable()
export class GlobalsVar {
    user: UsuarioModel = null;
    projects: Array<ProjetosInscritos>;
    session: string;
    apiUrl = 'http://192.168.0.101:8080/api';
}


