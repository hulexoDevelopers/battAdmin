import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from '../../../services/image.service';
import { tyreModel } from './../../../../adminModule/manageTyres/models/tyre';
import { tyreStockService } from './../../../services/tyreStock.service';
import { tyreService } from './../../../services/tyre.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editTyreStock',
  templateUrl: './editTyreStock.component.html',
  styleUrls: ['./editTyreStock.component.scss']
})
export class editTyreStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  tyre = new tyreModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  tyreId: string;

  stock;
  stockId;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editTyreStockComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private tyreStockService: tyreStockService,
    private tyreService:tyreService,
    private alert: alert,
    // private userService: userService
  ) {
    this.tyreId = data.tyreId;
    this.stockId = data.stockId;
    if (this.tyreId) {
      this.getTyreById();
    } else {
      this.onClose();
    }

  }


  //get tyre data with id
  getTyreById() {
    this.tyreService.getTyreById(this.tyreId).subscribe(res => {
      this.tyre.title = res.data.title;
      this.tyre.detail = res.data.detail;
      this.tyre.tyreId = res.data.tyreId;
      this.tyre.stock = res.data.stock;
      this.stock = this.tyre.stock.find(data => data.stockId == this.stockId);
      this.stock.updatedDate = new Date();
      // this.brand.brandId = res.data.brandId
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.tyre.imageUrl = res.data.imageUrl;
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


  updateTyre() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.updateTyreData()
    }
  }


  //update tyre data 
  updateTyreData() {
    this.tyre.userId = this.userInfoService.getAuthData();
    this.tyre.title = this.tyre.title.trim().toLowerCase();
    if (!this.tyre.title) {
      return;
    }
    // this.battery.detail = res.data.detail;

    this.tyreService.updateTyre(this.tyreId, this.tyre).subscribe(res => {
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
      this.tyre.imageUrl = res.url;
      this.updateTyreData(); //now saving brand data;
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
