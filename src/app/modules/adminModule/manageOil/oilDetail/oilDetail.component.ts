import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from '../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from '../../../shared/services/reource.service';
import { oilService } from './../../../shared/services/oil.service';
import { editOilComponent } from 'src/app/modules/shared/popups/oilModule/editOil/editOIl.component';
import { assignOilStockComponent } from './../../../shared/popups/oilModule/assignOilStock/assignOilStock.component';
import { updateOilStockComponent } from 'src/app/modules/shared/popups/oilModule/updateOilStock/updateOilStock.component';
import { editOilStockComponent } from 'src/app/modules/shared/popups/oilModule/editOilStock/editOilStock.component';

@Component({
  templateUrl: './oilDetail.component.html',
  styleUrls: ['./oilDetail.component.scss'],
})
export class oilDetailComponent implements OnInit {

  isDisabled: boolean = false;
  itemPerPage = 25;
  page = 1;

  oilId: string;
  oil;

  totalStock: number = 0;
  totalAssign: number = 0;
  totalSale: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oilService: oilService,
    private searchConfigService: searchConfigService,
    public resourceService: resourceService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {
    this.getParamsId();
  }


  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.oilId = params.id;
        if (!this.oilId) {
          this.data.goBack();
          return;
        } else {
          this.getOilDetail(this.oilId);
        }
      }
    });
  }


  //get oil detail
  getOilDetail(oilId: string) {
    this.oilService.getOilByIdAndData(oilId).subscribe(res => {
      if (res.success) {
        this.totalAssign = 0;
        this.totalStock = 0;
        this.totalSale = 0;
        this.oil = res.data[0];
        this.oil.stock = this.oil.stock.reverse();

        for (let i = 0; i < this.oil.stock.length; i++) {
          this.totalStock += this.oil.stock[i].quantity;
          this.totalAssign += this.oil.stock[i].assign;
          this.totalSale += this.oil.stock[i].totalSale;
        }
      } else {
        this.data.goBack();
      }
    })
  }

  //delete stock
  deleteStock(stock) {
    let value = this.checkAllowEdit(stock);
    if (value == true) {
      this.alert.responseAlert("You can't delete this stock", 'error');
      return
    }
    var index = this.oil.stock.indexOf(stock);
    if (index !== -1) {
      this.oil.stock.splice(index, 1);
    }

    this.oilService.updateOil(this.oilId, this.oil).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.getOilDetail(this.oilId);
        this.alert.responseAlert(res.message, 'success');
      }

    })
  }



  //edit oil stock
  editStock(stock): void {
    let stockId = stock.stockId;

    let value = this.checkAllowEdit(stock);
    if (value == true) {
      this.alert.responseAlert("You can't edit this stock", 'error');
      return
    }

    let data = {
      oilId: this.oilId,
      stockId: stockId
    }
    const dialogRef = this.dialog.open(editOilStockComponent, {
      data: data
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOilDetail(this.oilId);
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
      oilId: this.oilId,
      stockId: stockId
    }

    const dialogRef = this.dialog.open(assignOilStockComponent, {
      data: data,
      width: "400px",
      height: "300px"

    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.onRefresh();
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




  //edit oil
  editOil(): void {
    const dialogRef = this.dialog.open(editOilComponent, {
      data: this.oilId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamsId();
      }
    });
  }



  updateStock() {
    let data = {
      oilId: this.oilId,
    }

    const dialogRef = this.dialog.open(updateOilStockComponent, {
      data: data
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.totalStock = 0;
        this.totalAssign = 0;
        this.totalSale = 0;
        this.getParamsId();
      }
    });
  }



  //delete oil stock
  deleteOilStock(stock) {
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
