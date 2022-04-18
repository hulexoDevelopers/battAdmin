import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material";
// import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';

import { Data } from '../../../services/shareDataService';
import { resourceService } from './../../../services/reource.service';
import { searchConfigService } from './../../../services/search.config';
import { tyreService } from './../../../services/tyre.service';
import { tyreStockService } from './../../../services/tyreStock.service';
import { assignTyreStock } from '../../../models/assignTyreStock';

@Component({
  selector: 'app-assignTechStock',
  templateUrl: './assignTechnicianStock.component.html',
  styleUrls: ['./assignTechnicianStock.component.scss']
})
export class assignTechnicianStockComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  assign = new assignTyreStock();

  disabled: boolean = false;
  allTyres;
  tyre;
  stock;

  userConfig;
  user;
  allUsers;
  quantity;
  tyreId;
  stockId;
  techStock;

  isNew: boolean = false;
  min: number = 0;
  max: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<assignTechnicianStockComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private tyreService: tyreService,
    private resourceService: resourceService,
    private searchConfigService: searchConfigService,
    private tyreStockService: tyreStockService,
    private alert: alert,
    private Data: Data
  ) {
    this.allTyres = this.resourceService.allTyres;
    this.userConfig = this.searchConfigService.userConfig;
    this.tyreId = this.data.tyreId;
    this.stockId = this.data.stockId;
    if (this.tyreId) {
      this.getAllTechnicians();
      this.getTyreDetail(this.tyreId)
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


  //get tyre detail
  getTyreDetail(tyreId: string) {
    this.tyreService.getTyreById(tyreId).subscribe(res => {
      if (res.success) {
        this.tyre = res.data;
        this.stock = this.tyre.stock.find(data => data.stockId == this.stockId);
        console.log('stock ' + JSON.stringify(this.stock))
        this.min = 0;
        this.max = this.stock.quantity - this.stock.assign
      } else {
        console.log('tyre not found')
      }
    })
  }



  userChange(ev) {
    this.assign.techId = ev.value._id;
    this.getUserTyreStock();

  }

  //get user tyre stock detail
  getUserTyreStock() {
    let data = {
      tyreId: this.tyreId,
      stockId: this.stockId,
      techId: this.assign.techId
    }
    this.tyreStockService.getStockByUserAssign(data).subscribe(res => {
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
    this.assign.tyreId = this.tyreId;
    this.assign.stockId = this.stockId;
    this.assign.userId = this.userInfoService.getAuthData();
    this.assign.companyId = this.tyre.companyId;
    this.assign.price = this.tyre.price;
    this.assign.totalAssign = this.quantity;
    this.assign.totalSale = 0;
    if (this.quantity <= 0) {
      return;
    }
    this.tyreStockService.addNewTyreStock(this.assign).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
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
    this.tyreStockService.updateTyreStock(this.techStock._id, this.techStock).subscribe(res => {
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
    let stock = this.tyre.stock.find(data => data.stockId == this.stockId);
    stock.assign += this.quantity;
    this.tyreService.updateTyre(this.tyreId, this.tyre).subscribe(res => {
      // console.log('res' + JSON.stringify(res))
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
  }


}
