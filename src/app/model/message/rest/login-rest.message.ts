import { DefaultRestMessage } from './default-rest.message';

export class LoginProjectsRestMessage {
    projectId: number;
    projectName: string;
}

export class LoginRestMessage extends DefaultRestMessage {
    userId: number;
    profileId: number;
    profileWeight: number;
    projects: Array<LoginProjectsRestMessage>;
}
