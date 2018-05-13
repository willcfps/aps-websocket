import { DefaultRestMessage } from './default-rest.message';
import { UsuarioModel } from '../../usuario/usuario.model';
import { InspetorModel } from '../../inspetor/inspetor.model';

export class UserRestMessage extends DefaultRestMessage {
    user: InspetorModel;
    users: Array<InspetorModel>;
}
