import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from '../../../services/image.service';
import { Data } from './../../../services/shareDataService';
import { oilModel } from './../../../../adminModule/manageOil/models/oil';
import { oilService } from './../../../services/oil.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-updateOilStock',
  templateUrl: './updateOilStock.component.html',
  styleUrls: ['./updateOilStock.component.scss']
})
export class updateOilStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  oil = new oilModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  oilId: string;

  stock;
  stockId;

  oilData;
  quantity;
  detail;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<updateOilStockComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private oilService: oilService,
    private alert: alert,
    private Data: Data
    // private userService: userService
  ) {
    this.oilId = data.oilId;
    this.stockId = data.stockId;
    if (this.oilId) {
      this.getOilById();
    } else {
      this.onClose();
    }

  }


  //get oil data with id
  getOilById() {
    this.oilService.getOilById(this.oilId).subscribe(res => {
      this.oilData = res.data;
    })
  }



  ngOnInit() {

  }


  updateOilStock() {
    if (this.quantity <= 0) {
      this.alert.responseAlert("please enter stock quantity", "error");
      return;
    }
    let data = {
      stockId: this.Data.getRandomNumber(),
      oilId: this.oilData.oilId,
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
    this.oilData.stock.push(data);
    this.oilService.updateOil(this.oilId, this.oilData).subscribe(res => {
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
