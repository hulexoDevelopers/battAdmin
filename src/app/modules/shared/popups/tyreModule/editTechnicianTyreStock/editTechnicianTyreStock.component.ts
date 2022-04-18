import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alert } from '../../../services/sweetAlert.service';
import { Data } from '../../../services/shareDataService';
import { tyreService } from './../../../services/tyre.service';
import { tyreStockService } from './../../../services/tyreStock.service';

@Component({
  selector: 'app-editTechOilStock',
  templateUrl: './editTechnicianTyreStock.component.html',
  styleUrls: ['./editTechnicianTyreStock.component.scss']
})
export class editTechnicianTyreStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  disabled: boolean = false;
  allStock;
  quantity;
  tyreId;
  stockId;
  techId;

  techStock;
  editStock;
  min: number = 0;
  max: number = 0;

  tyre;
  isEdit: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editTechnicianTyreStockComponent>,
    private tyreService:  tyreService,
    private tyreStockService:tyreStockService,
    private alert: alert,
    private Data: Data
  ) {

    this.tyreId = this.data.tyreId;
    this.techId = this.data.techId;
    if (this.tyreId && this.techId) {
      this.getTyreDetail();
      this.getTechStockDetail()
    }
  }



  ngOnInit() {



  }

  //get tyre detail
  getTyreDetail() {
    this.tyreService.getTyreById(this.tyreId).subscribe(res => {
      this.tyre = res.data;
    })
  }



  //get technician stock detail
  getTechStockDetail() {
    let data = {
      techId: this.techId,
      tyreId: this.tyreId,
      stockId: this.stockId
    }
    this.tyreStockService.getTechTyreStockDetail(data).subscribe(res => {
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
    this.tyreStockService.updateTyreStock(this.editStock._id, this.editStock).subscribe(res => {
      if (res.success) {
        this.updateTyre();
        this.alert.responseAlert(res.message, "success");
        this.dialogRef.close(true);
      } else {
        this.alert.responseAlert(res.message, "error");
      }

    })
  }


  //increase tyre stock
  updateTyre() {
    if (this.quantity > this.max) {
      return;
    }
    let stock = this.tyre.stock.find(data => data.stockId == this.editStock.stockId);
    stock.assign -= this.quantity
    this.tyreService.updateTyre(this.tyreId, this.tyre).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }


  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
