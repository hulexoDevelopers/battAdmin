import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material";
// import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { batteryCompanyService } from '../../../services/batteryCompany.service';
import { imageService } from '../../../services/image.service';
import { Data } from '../../../services/shareDataService';
import { batteryCompany } from '../../../models/batteryCompany';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-newBatteryCompany',
  templateUrl: './addNewBatteryCompany.component.html',
  styleUrls: ['./addNewBatteryCompany.component.scss']
})
export class addNewBatteryCompanyComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  brand = new batteryCompany();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;

  disabled: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<addNewBatteryCompanyComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private batteryCompanyService: batteryCompanyService,
    private alert: alert,
    private Data: Data
    // private userService: userService
  ) { }



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


  saveNewBrand() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.saveBrandData()
    }
  }


  //save brand data 
  saveBrandData() {
    this.brand.userId = this.userInfoService.getAuthData();
    this.brand.title = this.brand.title.trim().toLowerCase();
    this.brand.brandId = this.Data.generateRandomString(6)
    if (!this.brand.title) {
      return;
    }
    this.batteryCompanyService.addNewBatteryCompany(this.brand).subscribe(res => {
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



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      this.brand.imageUrl = res.url;
      this.saveBrandData(); //now saving brand data;
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

}
