import { InspetorModel } from '../inspetor/inspetor.model';

export class ProjetoModel {
    id: number;
    description: string;
    title: string;

    owner: InspetorModel;
    participants: Array<InspetorModel>;

}
