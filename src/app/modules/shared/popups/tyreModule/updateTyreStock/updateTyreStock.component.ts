import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from '../../../services/image.service';
import { Data } from './../../../services/shareDataService';
import { tyreModel } from './../../../../adminModule/manageTyres/models/tyre';
import { tyreService } from './../../../services/tyre.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-updateTyreStock',
  templateUrl: './updateTyreStock.component.html',
  styleUrls: ['./updateTyreStock.component.scss']
})
export class updateTyreStockComponent implements OnInit {
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

  tyreData;
  quantity;
  detail;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<updateTyreStockComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private tyreService: tyreService,
    private alert: alert,
    private Data: Data
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
      this.tyreData = res.data;
    })
  }



  ngOnInit() {

  }


  updateTyreStock() {
    if (this.quantity <= 0) {
      this.alert.responseAlert("please enter stock quantity", "error");
      return;
    }
    let data = {
      stockId: this.Data.getRandomNumber(),
      tyreId: this.tyreData.tyreId,
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
    this.tyreData.stock.push(data);
    this.tyreService.updateTyre(this.tyreId, this.tyreData).subscribe(res => {
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
