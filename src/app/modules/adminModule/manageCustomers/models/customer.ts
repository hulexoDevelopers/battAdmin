export class customerModel {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: string = 'customer';
  contact: string;
  address: string;
  state: string;
  data: any = [];
  vehicles: any = [];
  imageUrl: string = '';
}
