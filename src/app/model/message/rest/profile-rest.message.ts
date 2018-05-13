import { DefaultRestMessage } from './default-rest.message';
import { PerfilUsuarioModel } from '../../usuario/perfil-usuario.model';

export class ProfileRestMessage extends DefaultRestMessage {
    profiles: Array<PerfilUsuarioModel>;
}
