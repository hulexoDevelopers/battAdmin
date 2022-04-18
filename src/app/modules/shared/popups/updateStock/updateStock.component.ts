import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material";
// import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { brands } from '../../models/carBrand';
import * as decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../auth/userInfoService';
import { alert } from '../../services/sweetAlert.service';
import { brandService } from '../../services/brand.service';
import { imageService } from '../../services/image.service';
import { batteryModel } from '../../../adminModule/manageBatteries/models/battery';
import { batteryService } from '../../services/battery.service';
import { Data } from './../../services/shareDataService';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-updateStock',
  templateUrl: './updateStock.component.html',
  styleUrls: ['./updateStock.component.scss']
})
export class updateBatteryStockComponent implements OnInit {
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

  batteryData;
  quantity;
  detail;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<updateBatteryStockComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private batteryService: batteryService,
    private alert: alert,
    private Data: Data
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
      this.batteryData = res.data;
    })
  }



  ngOnInit() {

  }


  updateBatteryStock() {
    if (this.quantity <= 0) {
      this.alert.responseAlert("please enter stock quantity", "error");
      return;
    }
    let data = {
      stockId: this.Data.getRandomNumber(),
      batteryId: this.batteryData.batteryId,
      quantity: this.quantity,
      assign: 0,
      unAssign: 0,
      totalSale: 0,
      type: 'new stock',
      createdDate: new Date(),
      isDeleted: false,
      detail: this.detail,
      updatedDate: ''
    }
    this.batteryData.stock.push(data);
    this.batteryService.updateBattery(this.batteryId, this.batteryData).subscribe(res => {
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

}
