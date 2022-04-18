export class agentModel {
    userId: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: string = 'agent';
    contact: string;
    address: string;
    state: string;
    data: any = [];
    vehicles: any = [];
    imageUrl: string = '';
}
