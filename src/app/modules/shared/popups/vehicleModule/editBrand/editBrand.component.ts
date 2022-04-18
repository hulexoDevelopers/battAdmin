import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material";
// import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { brands } from '../../../models/carBrand';
import * as decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { brandService } from './../../../services/brand.service';
import { imageService } from './../../../services/image.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editBrand',
  templateUrl: './editBrand.component.html',
  styleUrls: ['./editBrand.component.scss']
})
export class editBrandComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  brand = new brands();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  brandId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editBrandComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private brandService: brandService,
    private alert: alert,
    // private userService: userService
  ) {
    this.brandId = data;
    if (this.brandId) {
      this.getBrandById();
    } else {
      this.onClose();
    }

  }


  //get brand data with id
  getBrandById() {
    this.brandService.getBrandById(this.brandId).subscribe(res => {
      this.brand.title = res.data.title;
      this.brand.brandId = res.data.brandId
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.brand.imageUrl = res.data.imageUrl;
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


  updateBrand() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.updateBrandData()
    }
  }


  //update brand data 
  updateBrandData() {
    this.brand.userId = this.userInfoService.getAuthData();
    this.brand.title = this.brand.title.trim().toLowerCase();
    if (!this.brand.title) {
      return;
    }

    this.brandService.updateBrand(this.brandId, this.brand).subscribe(res => {
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
      this.brand.imageUrl = res.url;
      this.updateBrandData(); //now saving brand data;
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
