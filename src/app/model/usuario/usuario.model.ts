import { PerfilUsuarioModel } from './perfil-usuario.model';

export class ProjetosInscritos {
    projectId: number;
    projectName: string;
}

export class UsuarioModel {
    id: number;
    username: string;
    password: string;
    profile: PerfilUsuarioModel;
}
