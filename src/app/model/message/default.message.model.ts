
export class DefaultMessageModel {
    id: string;
    message: string;
    dateTime: string;
    from: string;
    name: string;
    send = true;
    visualized = false;
    position: number;
    response: DefaultMessageModel;
}
