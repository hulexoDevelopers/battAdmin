import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { batteryModel } from '../models/battery';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { batteryService } from './../../../shared/services/battery.service';
import { batteryCompanyService } from './../../../shared/services/batteryCompany.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { imageService } from './../../../shared/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { editBatteryComponent } from './../../../shared/popups/batteryModule/editBattery/editBattery.component';
import Swal from 'sweetalert2';
import { addNewBatteryCompanyComponent } from 'src/app/modules/shared/popups/batteryModule/addNewBatteryCompany/addNewBatteryCompany.component';
import { batteryStockService } from './../../../shared/services/batteryStock.service';



@Component({
  templateUrl: './addNewBattery.component.html',
  styleUrls: ['./addNewBattery.component.scss'],
})


export class addNewBatteryComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('moveTop') public moveTop: ElementRef;
  battery = new batteryModel();
  isDisabled: boolean = false;


  allBrands;
  allBatteries;
  brandConfig;
  brand = null;
  isCompany: boolean = false;
  isSubmitted: boolean = false;

  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  itemPerPage = 25;
  page = 1;

  isLoad: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batteryService: batteryService,
    private batteryCompanyService: batteryCompanyService,
    private searchConfigService: searchConfigService,
    private UserInfoService: UserInfoService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.brandConfig = this.searchConfigService.companyConfig;
  }



  ngOnInit() {
    this.getAllCompaniesList();
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
  }




  //add new company
  addNewcompany(): void {
    const dialogRef = this.dialog.open(addNewBatteryCompanyComponent, {
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCompaniesList(true);

      }
    });
  }



  //get all companies list
  getAllCompaniesList(val: boolean = false) {
    this.batteryCompanyService.getAllBatteryCompanysList().subscribe(res => {
      this.allBrands = res.data;
      if (val) {
        this.battery.companyId = res.data[0]._id;
        this.brand = res.data[0]
      }
      this.getAllBatteriesList();
    })
  }


  //get all batteries lise
  getAllBatteriesList() {
    this.batteryService.getAllBatteriesList().subscribe(res => {
      this.allBatteries = res.data;
      // this.allBatteries = res.data.filter(o1 => this.allBrands.some(o2 => o1.companyId === o2._id));

      this.isLoad = true;
    })
  }


  isRequired: boolean = true;
  brandChange(ev) {
    this.isCompany = true;
    this.battery.companyId = ev.value._id;
  }



  lowerCase() {
    this.battery.title = this.battery.title.toLowerCase().trim();
  }



  saveNewBattery() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.addNewBattery();
    }
  }


  addNewBattery() {
    this.battery.userId = this.UserInfoService.getAuthData();
    this.battery.batteryId = this.data.generateRandomString(6);
    this.battery.price = Number(this.battery.price);
    this.battery.quantity = Number(this.battery.quantity)
    let stock = {
      stockId: this.data.getRandomNumber(),
      batteryId: this.battery.batteryId,
      quantity: this.battery.quantity,
      assign: 0,
      unAssign: 0,
      totalSale: 0,
      type: 'opening',
      createdDate: new Date(),
      isDeleted: false,
      updatedDate: ''
    }
    this.disabled = true;
    this.battery.stock = [];
    this.battery.stock.push(stock);

    this.batteryService.addNewBattery(this.battery).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');

        // this.data.onRefresh();
        this.disabled = false;
        return;
      } else {
        this.getAllBatteriesList();
        this.alert.responseAlert(res.message, 'success');
        this.battery.imageUrl = ''
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



  //get company title
  getCompanyTitle(id: string) {
    let company = this.allBrands.find(data => data._id == id);
    if (company) {
      return company.title;
    }
    else {
      return '--'
      // this.allBatteries.splice(this.allBatteries.findIndex(this.matchesEl), 1);
    }

  }


  matchesEl(el, id) {
    return el.companyId != id;
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
      this.battery.imageUrl = res.url;
      this.addNewBattery(); //now saving brand data;
    })

    //  let id = this.packageDetailData._id
    // this.planService.upLoadImage(id, this.form.value.image)
    //   .subscribe(res => {
    //     this.alert.responseAlert("Plan created sccessfully", 'success');
    //     this.data.onRefresh();

    //})

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



  //edit battery
  editBattery(batteryId: string): void {
    const dialogRef = this.dialog.open(editBatteryComponent, {
      data: batteryId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBatteriesList();
      }
    });
  }




  //delete batery
  deleteBattery(batteryId: string) {
    this.confirmationDelete(batteryId);
  }

  //confirm delete battery
  confirmDelete(batteryId: string) {
    this.batteryService.deleteBattery(batteryId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllBatteriesList();

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

}
