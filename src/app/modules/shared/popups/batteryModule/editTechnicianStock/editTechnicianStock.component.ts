import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { Data } from '../../../services/shareDataService';
import { batteryService } from './../../../services/battery.service';
import { resourceService } from './../../../services/reource.service';
import { searchConfigService } from './../../../services/search.config';
import { batteryStockService } from './../../../services/batteryStock.service';

@Component({
  selector: 'app-editTechStock',
  templateUrl: './editTechnicianStock.component.html',
  styleUrls: ['./editTechnicianStock.component.scss']
})
export class editTechnicianStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  disabled: boolean = false;
  allStock;
  quantity;
  batteryId;
  stockId;
  techId;

  techStock;
  editStock;
  min: number = 0;
  max: number = 0;

  battery;
  isEdit: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editTechnicianStockComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private batteryService: batteryService,
    private resourceService: resourceService,
    private searchConfigService: searchConfigService,
    private batteryStockService: batteryStockService,
    private alert: alert,
    private Data: Data
  ) {

    this.batteryId = this.data.batteryId;
    this.techId = this.data.techId;
    if (this.batteryId && this.techId) {
      this.getbatteryDetail();
      this.getTechStockDetail()
    }
  }



  ngOnInit() {



  }

  //get battery detail
  getbatteryDetail() {
    this.batteryService.getBatteryById(this.batteryId).subscribe(res => {
      this.battery = res.data;
    })
  }



  //get technician stock detail
  getTechStockDetail() {
    let data = {
      techId: this.techId,
      batteryId: this.batteryId,
      stockId: this.stockId
    }
    this.batteryStockService.getTechBatteryStockDetail(data).subscribe(res => {
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
    this.batteryStockService.updateBatteryStock(this.editStock._id, this.editStock).subscribe(res => {
      if (res.success) {
        this.updateBattery()
        this.alert.responseAlert(res.message, "success");
        this.dialogRef.close(true);
      } else {
        this.alert.responseAlert(res.message, "error");
      }

    })
  }


  //increase battery stock
  updateBattery() {
    if (this.quantity > this.max) {
      return;
    }
    let stock = this.battery.stock.find(data => data.stockId == this.editStock.stockId);
    stock.assign -= this.quantity
    this.batteryService.updateBattery(this.batteryId, this.battery).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }


  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
