import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { customerModel } from '../models/customer';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from '../..//..//shared/services/shareDataService';
import { MatDialog } from '@angular/material/dialog';
import { technicianService } from '../../../shared/services/technician.service';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { imageService } from '../../../shared/services/image.service';
import Swal from 'sweetalert2';
import { userService } from '../../../shared/services/user.service';
import { editUserProfileComponent } from 'src/app/modules/shared/popups/editUser/editUser.component';
import { brandService } from './../../../shared/services/brand.service';
import { vehicleService } from './../../manageVehicles/services/vehicleService';
import { washVehiclesComponent } from 'src/app/modules/shared/popups/getWashVehicles/getWashVehicles.component';


export interface packageModel {
  id: number;
  days: string;
  price: number;
  salePrice: number;
  discountPrice: number;
  status: string;
}
@Component({
  templateUrl: './addNewCustomer.component.html',
  styleUrls: ['./addNewCustomer.component.scss'],
})
export class addNewCustomerComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  customer = new customerModel();
  isDisabled: boolean = false;


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  allCustomers;


  itemPerPage = 100;
  page = 1;

  allStates;
  state = null;

  brand;
  model;

  customerVehicles = [];

  allCarBrands;
  allVehicles;
  brandVehicles;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technicianService: technicianService,
    private brandService: brandService,
    private vehicleService: vehicleService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.allStates = this.data.getAllStates();
    this.getAllBrands(); //get all brands list;
    this.getAllVehiclesList(); //get all vehicles list;
  }


  //get all brands
  getAllBrands() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.allCarBrands = res.data;
    })
  }

  //get all vehicles list
  getAllVehiclesList() {
    this.vehicleService.getAllVehicleList().subscribe(res => {
      this.allVehicles = res.data;
    })
  }





  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      })
    });
    // this.getAllBrandsList();
    // this.getAllBatteriesList();
    this.getAllCustomersList();
  }



  //get all customers list
  getAllCustomersList() {
    this.userService.getAllUsers().subscribe(res => {
      this.allCustomers = res.data.filter(data => data.role == 'customer');
    })
  }




  stateChange(ev) {
    // console.log('ev ' + ev.target.value);
    this.customer.state = ev.target.value;
  }


  saveNewCustomer() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload customer only
      this.addNewCustomer();
    }
  }



  addNewCustomer() {
    this.customer.userId = this.UserInfoService.getAuthData();
    this.customer.role = 'customer';
    this.customer.password = this.customer.contact;
    // this.vehicle.batteries = this.selectedBatteries
    this.disabled = true;
    // console.log('add new vehicle' + JSON.stringify(this.vehicle));

    if (this.customerVehicles.length > 0) {
      this.customer.vehicles = this.customerVehicles;
    }
    this.userService.addNewUser(this.customer).subscribe(res => {
      if (!res.success) {
        this.alert.actionResponse(res.message, 'error');
        this.customerVehicles = [];
        // this.data.onRefresh();
        this.disabled = false;
        return;
      } else {
        this.getAllCustomersList(); //get all technician list
        this.alert.actionResponse(res.message, 'success');
        this.customer.imageUrl = ''
        this.myInputVariable.nativeElement.value = ''
        this.image = '';
        this.imagePreview = '';
        document.getElementById('cancelBtn').click();
        this.myInputVariable.nativeElement.value = ''
        this.disabled = false;
        // this.companyUser = res.data
        // this.saveCompanyProfile();
      }
    })

  }





  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    this.image = this.form.value.image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    this.image = this.form.value.image
    this.validImage();
    this.ValidImageSize();



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      this.customer.imageUrl = res.url;
      this.addNewCustomer(); //now saving new customer;
    })

  }

  validFile
  invalidType
  inValidImage
  validImage() {

    if (this.image.type === 'image/jpeg' ||
      this.image.type === 'image/png' ||
      this.image.type === 'image/jpg' ||
      this.image.type === 'image/svg') {
    } else {
      this.alert.responseAlert("Image is not valid", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
    }

  }


  ValidImageSize() {
    if (this.image.size > 200000) {
      this.alert.responseAlert("Image is too large", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
      return;
    }
  }




  //edit profile
  editProfile(userId: string): void {
    const dialogRef = this.dialog.open(editUserProfileComponent, {
      data: userId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCustomersList();
      }
    });
  }





  //delete profile
  deleteTechnician(userId: string) {
    this.confirmationDelete(userId);
  }

  //confirm delete technician
  confirmDelete(userId: string) {
    this.userService.deleteUser(userId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllCustomersList();

      }
    })
  }



  confirmationDelete(catId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.confirmDelete(catId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your  file is safe :)',
        //   'error'
        // )
      }
    })
  }



  addVehicles(): void {
    const dialogRef = this.dialog.open(washVehiclesComponent, {
      // data: this.selectedpackage
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerVehicles.push(result._id)
        // this.getAllBatteriesList();
      }
    });
  }

  //get vehicle title
  getVehicleTitle(carId) {
    const veh = this.allVehicles.find(data => data._id == carId);
    if (veh) {
      const brand = this.allCarBrands.find(data => data._id == veh.brandId)
      const data = {
        brand: brand.title,
        model: veh.title,
      }
      return data
    }
  }

  pushVehicle(carId: string) {

    this.customerVehicles.push()
  }

  deleteVehicle(car) {
    this.customerVehicles = this.customerVehicles.filter(data => data != car);
  }
}
