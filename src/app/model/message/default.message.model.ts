export enum DefaultMessageType {
    NEW, ACK
}

export class DefaultMessageModel {
    id: string;
    type: DefaultMessageType;
    message: string;
    ack: boolean;

    from: string;
}
