import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from './../../../services/image.service';
import { oilModel } from './../../../../adminModule/manageOil/models/oil';
import { searchConfigService } from './../../../services/search.config';
import { resourceService } from './../../../services/reource.service';
import { oilService } from './../../../services/oil.service';
import { companyService } from './../../../services/company.service';


@Component({
  selector: 'app-editOil',
  templateUrl: './editOil.component.html',
  styleUrls: ['./editOil.component.scss']
})
export class editOilComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  oil = new oilModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  oilId: string;

  allCompanies;
  company;
  brandConfig;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editOilComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private companyService: companyService,
    private resourceService: resourceService,
    private oilService: oilService,
    private searchConfigService: searchConfigService,
    private alert: alert,
  ) {
    if (this.resourceService.allCompanies) {
      this.allCompanies = this.resourceService.allCompanies.filter(data => data.type == 'oil')
    }

    this.getAllCompanies();
    this.brandConfig = this.searchConfigService.brandConfig;
    this.oilId = data;
    if (this.oilId) {
      this.getOilById();
    } else {
      this.onClose();
    }

  }

  //get all companies
  getAllCompanies() {
    this.companyService.getAllCompanysList().subscribe(res => {
      this.allCompanies = res.data.filter(data => data.type == 'oil');
    })
  }

  companyChange(ev) {
    this.oil.companyId = ev.value._id;
  }


  //get oil by id
  getOilById() {
    this.oilService.getOilById(this.oilId).subscribe(res => {
      this.oil.title = res.data.title;
      this.oil.detail = res.data.detail;
      this.oil.oilId = res.data.oilId;
      this.oil.price = res.data.price;
      if (res.data.companyId) {
        let company = this.allCompanies.find(data => data._id == res.data.companyId);
        if (company) {
          this.oil.companyId = res.data.companyId;
          this.company = company;
        }

      }
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.oil.imageUrl = res.data.imageUrl;
        this.imagePreview = res.data.imageUrl;
      }
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
  }


  updateOil() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload oil only
      this.updateOilData()
    }
  }


  //update oil data 
  updateOilData() {
    this.oil.userId = this.userInfoService.getAuthData();
    this.oil.title = this.oil.title.trim().toLowerCase();
    if (!this.oil.title) {
      return;
    }

    // this.battery.detail = res.data.detail;

    this.oilService.updateOil(this.oilId, this.oil).subscribe(res => {
      if (res.success) {
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
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

    // if (this.image.size > 200000) {
    //   this.alert.responseAlert("Image is too large", 'error');
    //   this.image = ''
    //   this.imagePreview = ''
    //   this.myInputVariable.nativeElement.value = "";
    //   return;
    // }
    this.validImage();
    this.ValidImageSize();

    this.editImage = true;



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      this.oil.imageUrl = res.url;
      this.updateOilData(); //now saving oil data;
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

}
