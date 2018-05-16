import { InspetorModel } from '../inspetor/inspetor.model';

export class ProjetoModel {
    id: number;
    description: string;
    title: string;

    owner = new InspetorModel();
    participants: Array<InspetorModel>;

}
