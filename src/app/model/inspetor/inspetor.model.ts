import { UsuarioModel } from '../usuario/usuario.model';

export class InspetorModel {
    id: number;
    name: string;
    user: UsuarioModel;

    online = false;
}
