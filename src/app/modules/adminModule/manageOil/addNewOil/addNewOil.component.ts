import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { oilModel } from '../models/oil';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { oilService } from './../../../shared/services/oil.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { imageService } from './../../../shared/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { addNewCompanyComponent } from './../../../shared/popups/companyModule/addNewCompany/addNewCompany.component';
import { companyService } from './../../../shared/services/company.service';
import { editOilComponent } from './../../../shared/popups/oilModule/editOil/editOIl.component';




@Component({
  templateUrl: './addNewOil.component.html',
  styleUrls: ['./addNewOil.component.scss'],
})


export class addNewOilComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('moveTop') public moveTop: ElementRef;
  oil = new oilModel();
  isDisabled: boolean = false;

  allCompanies
  allOils;
  companyConfig;
  company = null;
  isCompany: boolean = false;
  isSubmitted: boolean = false;

  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  itemPerPage = 5;
  page = 1;

  isLoad: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oilService: oilService,
    private companyService: companyService,
    private searchConfigService: searchConfigService,
    private UserInfoService: UserInfoService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.companyConfig = this.searchConfigService.companyConfig;
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
    const dialogRef = this.dialog.open(addNewCompanyComponent, {
      data: 'oil'
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCompaniesList(true);

      }
    });
  }



  //get all companies list
  getAllCompaniesList(val: boolean = false) {
    this.companyService.getAllCompanysList().subscribe(res => {
      this.allCompanies = res.data.filter(data => data.type == 'oil');
      if (val) {
        this.oil.companyId = res.data[0]._id;
        this.company = res.data[0]
      }
      this.getAllOilsList();
    })
  }


  //get all oils list
  getAllOilsList() {
    this.oilService.getAllOilsWithCompanies().subscribe(res => {
      this.allOils = res.data;
      this.isLoad = true;
    })
  }


  isRequired: boolean = true;
  companyChange(ev) {
    this.isCompany = true;
    this.oil.companyId = ev.value._id;
  }



  lowerCase() {
    this.oil.title = this.company.title.toLowerCase().trim();
  }



  saveNewOil() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload oil only
      this.addNewOil();
    }
  }


  addNewOil() {
    this.oil.userId = this.UserInfoService.getAuthData();
    this.oil.oilId = this.data.generateRandomString(6);
    this.oil.price = Number(this.oil.price);
    this.oil.quantity = Number(this.oil.quantity)
    let stock = {
      stockId: this.data.getRandomNumber(),
      oilId: this.oil.oilId,
      quantity: this.oil.quantity,
      assign: 0,
      unAssign: 0,
      totalSale: 0,
      type: 'opening',
      createdDate: new Date(),
      isDeleted: false,
      updatedDate: ''
    }
    this.disabled = true;
    this.oil.stock = [];
    this.oil.stock.push(stock);

    this.oilService.addNewOil(this.oil).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
        this.disabled = false;
        return;
      } else {
        this.getAllOilsList();
        this.alert.responseAlert(res.message, 'success');
        this.oil.imageUrl = ''
        this.myInputVariable.nativeElement.value = ''
        this.image = '';
        this.imagePreview = '';
        document.getElementById('cancelBtn').click();
        this.myInputVariable.nativeElement.value = ''
        this.disabled = false;

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
      this.oil.imageUrl = res.url;
      this.addNewOil(); //now saving oil data;
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



  //edit oil
  editOil(oilId: string): void {
    const dialogRef = this.dialog.open(editOilComponent, {
      data: oilId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllOilsList();
      }
    });
  }




  //delete oil
  deleteOil(oilId: string) {
    this.confirmationDelete(oilId);
  }

  //confirm delete oil
  confirmDelete(oilId: string) {
    this.oilService.deleteOil(oilId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        this.getAllOilsList();

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
