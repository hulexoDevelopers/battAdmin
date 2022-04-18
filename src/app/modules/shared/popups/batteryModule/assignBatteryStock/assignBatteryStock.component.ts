import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';

import { Data } from '../../../services/shareDataService';
import { assignStock } from '../../../models/assign';
import { batteryService } from './../../../services/battery.service';
import { resourceService } from './../../../services/reource.service';
import { searchConfigService } from './../../../services/search.config';
import { batteryStockService } from './../../../services/batteryStock.service';
import { tyreService } from './../../../services/tyre.service';
import { tyreStockService } from './../../../services/tyreStock.service';
import { assignTyreStock } from '../../../models/assignTyreStock';

@Component({
  selector: 'app-assignBatteryStock',
  templateUrl: './assignBatteryStock.component.html',
  styleUrls: ['./assignBatteryStock.component.scss']
})
export class assignBatteryStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  assign = new assignStock();

  disabled: boolean = false;
  allBatteries;
  battery;
  stock;

  userConfig;
  user;
  allUsers;
  quantity;
  batteryId;
  stockId;
  techStock;

  isNew: boolean = false;
  min: number = 0;
  max: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<assignBatteryStockComponent>,
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
    this.allBatteries = this.resourceService.allBatteries;
    this.userConfig = this.searchConfigService.userConfig;
    this.batteryId = this.data.batteryId;
    this.stockId = this.data.stockId;
    if (this.batteryId) {
      this.getAllTechnicians();
      this.getBatteryDetail(this.batteryId)
    } else {
      this.dialogRef.close();
    }
  }



  ngOnInit() {



  }

  //get all technicians list
  getAllTechnicians() {
    this.userService.getAllUsers().subscribe(res => {
      this.allUsers = res.data.filter(data => data.role == 'technician');
      for (let i = 0; i < this.allUsers.length; i++) {
        this.allUsers[i].custom = this.allUsers[i].firstName + ' ' + this.allUsers[i].lastName
      }
    })
  }


  //get battery detail
  getBatteryDetail(batteryId: string) {
    this.batteryService.getBatteryById(batteryId).subscribe(res => {
      if (res.success) {
        this.battery = res.data;
        this.stock = this.battery.stock.find(data => data.stockId == this.stockId);
        this.min = 0;
        this.max = this.stock.quantity - this.stock.assign
      } else {
        console.log('tyre not found')
      }
    })
  }



  userChange(ev) {
    this.assign.techId = ev.value._id;
    this.getUserBatteryStock();

  }

  //get user battery stock detail
  getUserBatteryStock() {
    let data = {
      batteryId: this.batteryId,
      stockId: this.stockId,
      techId: this.assign.techId
    }
    this.batteryStockService.getStockByUserAssign(data).subscribe(res => {
      if (res.success) {
        this.isNew = false;
        this.techStock = res.data;
      } else {
        this.isNew = true;
      }
    })
  }

  assignStock() {
    if (this.quantity > this.max || this.quantity < this.min) {
      this.alert.responseAlert("please enter quanity between " + this.min + " and " + this.max, "error")
      return
    }
    if (this.isNew == true) {
      this.saveNewStock();
    } else {
      this.updateStock();
    }
  }

  //assign stock 
  saveNewStock() {
    this.assign.batteryId = this.batteryId;
    this.assign.stockId = this.stockId;
    this.assign.userId = this.userInfoService.getAuthData();
    this.assign.companyId = this.battery.companyId;
    this.assign.price = this.battery.price;
    this.assign.totalAssign = this.quantity;
    this.assign.totalSale = 0;
    if (this.quantity <= 0) {
      return;
    }
    this.batteryStockService.addNewBatteryStock(this.assign).subscribe(res => {
      if (res.success) {
        this.updateTyre();
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    })
  }


  //update stocl
  updateStock() {
    this.techStock.totalAssign += this.quantity;
    this.techStock.updated_at = new Date();
    this.batteryStockService.updateBatteryStock(this.techStock._id, this.techStock).subscribe(res => {
      if (res.success) {
        this.updateTyre();
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    });

  }



  updateTyre() {
    let stock = this.battery.stock.find(data => data.stockId == this.stockId);
    stock.assign += this.quantity;
    this.batteryService.updateBattery(this.batteryId, this.battery).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
