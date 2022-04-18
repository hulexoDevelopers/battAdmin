import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { Data } from '../../../services/shareDataService';
import { resourceService } from './../../../services/reource.service';
import { searchConfigService } from './../../../services/search.config';
import { oilService } from './../../../services/oil.service';
import { oilStockService } from './../../../services/oilStock.service';

@Component({
  selector: 'app-editTechOilStock',
  templateUrl: './editTechnicianOilStock.component.html',
  styleUrls: ['./editTechnicianOilStock.component.scss']
})
export class editTechnicianOilStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  disabled: boolean = false;
  allStock;
  quantity;
  oilId;
  stockId;
  techId;

  techStock;
  editStock;
  min: number = 0;
  max: number = 0;

  oil;
  isEdit: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editTechnicianOilStockComponent>,
    private oilService:  oilService,
    private oilStockService:oilStockService,
    private alert: alert,
    private Data: Data
  ) {

    this.oilId = this.data.oilId;
    this.techId = this.data.techId;
    if (this.oilId && this.techId) {
      this.getOilDetail();
      this.getTechStockDetail()
    }
  }



  ngOnInit() {



  }

  //get oil detail
  getOilDetail() {
    this.oilService.getOilById(this.oilId).subscribe(res => {
      this.oil = res.data;
    })
  }



  //get technician stock detail
  getTechStockDetail() {
    let data = {
      techId: this.techId,
      oilId: this.oilId,
      stockId: this.stockId
    }
    this.oilStockService.getTechOilStockDetail(data).subscribe(res => {
      if (res.success) {
        this.techStock = res.data;
      }
    })
  }


  editTechnicianStock(stock) {
    this.editStock = stock;
    this.min = 1;
    this.max = stock.totalAssign - stock.totalSale;
    this.isEdit = true;
  }


  editStockDetail() {
    if (this.quantity > this.max || this.quantity < this.min) {
      this.alert.responseAlert(`Please enter quantity between ${this.min} and ${this.max}`, "error");
      return;
    }
    this.editStock.totalAssign -= this.quantity;
    this.oilStockService.updateOilStock(this.editStock._id, this.editStock).subscribe(res => {
      if (res.success) {
        this.updateOil();
        this.alert.responseAlert(res.message, "success");
        this.dialogRef.close(true);
      } else {
        this.alert.responseAlert(res.message, "error");
      }

    })
  }


  //increase oil stock
  updateOil() {
    if (this.quantity > this.max) {
      return;
    }
    let stock = this.oil.stock.find(data => data.stockId == this.editStock.stockId);
    stock.assign -= this.quantity
    this.oilService.updateOil(this.oilId, this.oil).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }


  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
