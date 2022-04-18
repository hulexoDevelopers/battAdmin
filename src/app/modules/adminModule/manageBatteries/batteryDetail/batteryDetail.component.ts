import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from '../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { batteryCompanyService } from '../../../shared/services/batteryCompany.service';
import { resourceService } from '../../../shared/services/reource.service';
import { batteryService } from './../../../shared/services/battery.service';
import { editBatteryStockComponent } from './../../../shared/popups/batteryModule/editBatteryStock/editBatteryStock.component';

import { updateBatteryStockComponent } from '../../../shared/popups/updateStock/updateStock.component';
import { editBatteryComponent } from 'src/app/modules/shared/popups/batteryModule/editBattery/editBattery.component';
import { assignBatteryStockComponent } from './../../../shared/popups/batteryModule/assignBatteryStock/assignBatteryStock.component';


@Component({
  templateUrl: './batteryDetail.component.html',
  styleUrls: ['./batteryDetail.component.scss'],
})
export class batteryDetailComponent implements OnInit {

  isDisabled: boolean = false;

  allcompanies;

  itemPerPage = 5;
  page = 1;

  batteryId: string;
  battery;

  totalStock: number = 0;
  totalAssign: number = 0;
  totalSale: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batteryCompanyService: batteryCompanyService,
    private batteryService: batteryService,
    private searchConfigService: searchConfigService,
    public resourceService: resourceService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {
    this.allcompanies = this.resourceService.allBatteryBrands;
    this.getParamsId();
  }


  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.batteryId = params.id;
        if (!this.batteryId) {
          this.data.goBack();
          return;
        } else {
          this.getBatteryDetail(this.batteryId);
        }
      }
    });
  }


  //get battery detail
  getBatteryDetail(batteryId: string) {
    this.batteryService.getBatteryById(batteryId).subscribe(res => {
      if (res.success) {
        this.totalAssign = 0;
        this.totalStock = 0;
        this.battery = res.data;
        this.battery.stock = this.battery.stock.reverse();

        for (let i = 0; i < this.battery.stock.length; i++) {
          this.totalStock += this.battery.stock[i].quantity;
          this.totalAssign += this.battery.stock[i].assign;
          this.totalSale += this.battery.stock[i].totalSale;
        }
      } else {
        this.data.goBack();
      }
    })
  }

  //delete stock
  deleteStock(stock) {

    let stockId = stock.stockId;

    let value = this.checkAllowEdit(stock);
    if (value == true) {
      this.alert.responseAlert("You can't delete this stock", 'error');
      return
    }
    var index = this.battery.stock.indexOf(stock);
    if (index !== -1) {
      this.battery.stock.splice(index, 1);
    }

    this.batteryService.updateBattery(this.batteryId, this.battery).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
      }

    })
  }



  //edit battery stock
  editStock(stock): void {
    let stockId = stock.stockId;

    let value = this.checkAllowEdit(stock);
    if (value == true) {
      this.alert.responseAlert("You can't edit this stock", 'error');
      return
    }

    let data = {
      batteryId: this.batteryId,
      stockId: stockId
    }
    const dialogRef = this.dialog.open(editBatteryStockComponent, {
      data: data
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBatteryDetail(this.batteryId);
      }
    });
  }



  //assign stock
  assignStock(stock): void {

    let stockId = stock.stockId;

    let value = this.checkValid(stock);
    if (value == true) {
      this.alert.responseAlert("You can't assign this stock", 'error');
      return
    }
    let data = {
      batteryId: this.batteryId,
      stockId: stockId
    }

    const dialogRef = this.dialog.open(assignBatteryStockComponent, {
      data: data,
      width: "400px",
      height: "300px"

    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBatteryDetail(this.batteryId);
      }
    });
  }


  checkValid(stock) {

    // let stock = this.battery.stock.find(data => data.stockId == stockId);
    if (stock.quantity <= stock.assign) {
      // this.alert.actionResponse('', 'error');
      return true;
    } else {
      return false;
    }
  }


  checkAllowEdit(stock) {
    if (stock.assign > 0) {
      // this.alert.actionResponse('', 'error');
      return true;
    } else {
      return false;
    }
  }




  //edit battery
  editBattery(): void {
    const dialogRef = this.dialog.open(editBatteryComponent, {
      data: this.batteryId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamsId();
      }
    });
  }



  updateStock() {
    let data = {
      batteryId: this.batteryId,
    }

    const dialogRef = this.dialog.open(updateBatteryStockComponent, {
      data: data
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.totalStock = 0;
        this.totalAssign = 0;
        this.getParamsId();
      }
    });
  }



  //delete batery
  deleteBatteryStock(stock) {
    this.confirmationDelete(stock);
  }





  confirmationDelete(stock) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteStock(stock);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your  file is safe :)',
        //   'error'
        // )
      }
    })
  }


}
