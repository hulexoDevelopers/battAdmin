export class inquiryModel {
  userId: string;
  inquiryId: string;
  contactNo: string;
  customerId: string;
  personalInfo: object;
  address: any;
  serviceType: string;
  serviceDetail: any;
  vehicleDetail: any;
  inquiryFrom: string = null;
  inquiryStatus: string;
  orderStatus: string = 'pending';
  inquiryNote: string;
  remarks: string;
  inquiryDetail: string;
}
