import { DefaultRestMessage } from './default-rest.message';
import { ProjetoModel } from '../../projeto/projeto.model';

export class ProjectRestMessage extends DefaultRestMessage {
    project: ProjetoModel;
}
