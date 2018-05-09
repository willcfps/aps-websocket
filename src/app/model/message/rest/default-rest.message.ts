export class DefaultRestMessageStatus {
    static OK = 'OK';
    static WAITING = 'WAITING';
    static ERROR = 'ERROR';
    static UNAUTHORIZED = 'UNAUTHORIZED';
}

export class DefaultRestMessage {

    status: DefaultRestMessageStatus;
    shortMessage: string;
    message: string;

}
