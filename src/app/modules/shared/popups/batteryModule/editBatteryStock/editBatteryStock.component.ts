import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from '../../../services/image.service';
import { batteryModel } from '../../../../adminModule/manageBatteries/models/battery';
import { batteryService } from '../../../services/battery.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editBatteryStock',
  templateUrl: './editBatteryStock.component.html',
  styleUrls: ['./editBatteryStock.component.scss']
})
export class editBatteryStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  battery = new batteryModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  batteryId: string;

  stock;
  stockId;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editBatteryStockComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private batteryService: batteryService,
    private alert: alert,
    // private userService: userService
  ) {
    this.batteryId = data.batteryId;
    this.stockId = data.stockId;
    if (this.batteryId) {
      this.getBatteryById();
    } else {
      this.onClose();
    }

  }


  //get battery data with id
  getBatteryById() {
    this.batteryService.getBatteryById(this.batteryId).subscribe(res => {
      this.battery.title = res.data.title;
      this.battery.detail = res.data.detail;
      this.battery.batteryId = res.data.batteryId;
      this.battery.stock = res.data.stock;
      this.stock = this.battery.stock.find(data => data.stockId == this.stockId);
      this.stock.updatedDate = new Date();
      // this.brand.brandId = res.data.brandId
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.battery.imageUrl = res.data.imageUrl;
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


  updateBattery() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.updateBatteryData()
    }
  }


  //update brand data 
  updateBatteryData() {
    this.battery.userId = this.userInfoService.getAuthData();
    this.battery.title = this.battery.title.trim().toLowerCase();
    if (!this.battery.title) {
      return;
    }
    // this.battery.detail = res.data.detail;

    this.batteryService.updateBattery(this.batteryId, this.battery).subscribe(res => {
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
      this.battery.imageUrl = res.url;
      this.updateBatteryData(); //now saving brand data;
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
