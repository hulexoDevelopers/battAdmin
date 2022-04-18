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
import { tyreStockService } from './../../../services/tyreStock.service';
import { oilService } from './../../../services/oil.service';
import { oilStockService } from './../../../services/oilStock.service';
import { assignOilStock } from '../../../models/assignOilStock';

@Component({
  selector: 'app-assignOilStock',
  templateUrl: './assignOilStock.component.html',
  styleUrls: ['./assignOilStock.component.scss']
})
export class assignOilStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  assign = new assignOilStock();

  disabled: boolean = false;
  allOils;
  oil;
  stock;

  userConfig;
  user;
  allUsers;
  quantity;
  oilId;
  stockId;
  techStock;

  isNew: boolean = false;
  min: number = 0;
  max: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<assignOilStockComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private oilService: oilService,
    private resourceService: resourceService,
    private searchConfigService: searchConfigService,
    private oilStockService:oilStockService,
    private tyreStockService: tyreStockService,
    private alert: alert,
    private Data: Data
  ) {
    this.allOils = this.resourceService.alloils;
    this.userConfig = this.searchConfigService.userConfig;
    this.oilId = this.data.oilId;
    this.stockId = this.data.stockId;

    console.log('oil id ' + this.oilId)
    if (this.oilId) {
      this.getAllTechnicians();
      this.getOilDetail(this.oilId)
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


  //get oil detail
  getOilDetail(oilId: string) {
    this.oilService.getOilById(oilId).subscribe(res => {
      if (res.success) {
        this.oil = res.data;
        this.stock = this.oil.stock.find(data => data.stockId == this.stockId);
        this.min = 0;
        this.max = this.stock.quantity - this.stock.assign
      } else {
        console.log('oil not found')
      }
    })
  }



  userChange(ev) {
    this.assign.techId = ev.value._id;
    this.getUserOilStock();

  }

  //get user oil stock detail
  getUserOilStock() {
    let data = {
      oilId: this.oilId,
      stockId: this.stockId,
      techId: this.assign.techId
    }
    this.oilStockService.getStockByUserAssign(data).subscribe(res => {
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
    this.assign.oilId = this.oilId;
    this.assign.stockId = this.stockId;
    this.assign.userId = this.userInfoService.getAuthData();
    this.assign.companyId = this.oil.companyId;
    this.assign.price = this.oil.price;
    this.assign.totalAssign = this.quantity;
    this.assign.totalSale = 0;
    if (this.quantity <= 0) {
      return;
    }
    this.oilStockService.addNewOilStock(this.assign).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
      if (res.success) {
        this.updateOil();
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
    this.oilStockService.updateOilStock(this.techStock._id, this.techStock).subscribe(res => {
      if (res.success) {
        this.updateOil();
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    });

  }



  updateOil() {
    let stock = this.oil.stock.find(data => data.stockId == this.stockId);
    stock.assign += this.quantity;
    this.oilService.updateOil(this.oilId, this.oil).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
