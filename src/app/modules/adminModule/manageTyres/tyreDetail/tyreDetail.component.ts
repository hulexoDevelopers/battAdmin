import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from '../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { batteryCompanyService } from '../../../shared/services/batteryCompany.service';
import { resourceService } from '../../../shared/services/reource.service';
import { tyreService } from './../../../shared/services/tyre.service';
import { assignTechnicianStockComponent } from './../../../shared/popups/tyreModule/assignTechnicianStock/assignTechnicianStock.component';
import { editTyreComponent } from 'src/app/modules/shared/popups/tyreModule/editTyre/editTyre.component';
import { updateTyreStockComponent } from 'src/app/modules/shared/popups/tyreModule/updateTyreStock/updateTyreStock.component';
import { editTyreStockComponent } from 'src/app/modules/shared/popups/tyreModule/editTyreStock/editTyreStock.component';


@Component({
  templateUrl: './tyreDetail.component.html',
  styleUrls: ['./tyreDetail.component.scss'],
})
export class tyreDetailComponent implements OnInit {

  isDisabled: boolean = false;
  itemPerPage = 25;
  page = 1;

  tyreId: string;
  tyre;

  totalStock: number = 0;
  totalAssign: number = 0;
  totalSale: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batteryCompanyService: batteryCompanyService,
    private tyreService: tyreService,
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
        this.tyreId = params.id;
        if (!this.tyreId) {
          this.data.goBack();
          return;
        } else {
          this.getTyreDetail(this.tyreId);
        }
      }
    });
  }


  //get tyre detail
  getTyreDetail(tyreId: string) {
    this.tyreService.getTyreByIdAndData(tyreId).subscribe(res => {
      if (res.success) {
        this.totalAssign = 0;
        this.totalStock = 0;
        this.totalSale = 0;
        this.tyre = res.data[0];
        this.tyre.stock = this.tyre.stock.reverse();

        for (let i = 0; i < this.tyre.stock.length; i++) {
          this.totalStock += this.tyre.stock[i].quantity;
          this.totalAssign += this.tyre.stock[i].assign;
          this.totalSale += this.tyre.stock[i].totalSale;
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
    var index = this.tyre.stock.indexOf(stock);
    if (index !== -1) {
      this.tyre.stock.splice(index, 1);
    }

    this.tyreService.updateTyre(this.tyreId, this.tyre).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.getTyreDetail(this.tyreId);
        this.alert.responseAlert(res.message, 'success');
      }

    })
  }



  //edit tyre stock
  editStock(stock): void {
    let stockId = stock.stockId;

    let value = this.checkAllowEdit(stock);
    if (value == true) {
      this.alert.responseAlert("You can't edit this stock", 'error');
      return
    }

    let data = {
      tyreId: this.tyreId,
      stockId: stockId
    }
    const dialogRef = this.dialog.open(editTyreStockComponent, {
      data: data
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTyreDetail(this.tyreId);
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
      tyreId: this.tyreId,
      stockId: stockId
    }

    const dialogRef = this.dialog.open(assignTechnicianStockComponent, {
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




  //edit battery
  editTyre(): void {
    const dialogRef = this.dialog.open(editTyreComponent, {
      data: this.tyreId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamsId();
      }
    });
  }



  updateStock() {
    let data = {
      tyreId: this.tyreId,
    }

    const dialogRef = this.dialog.open(updateTyreStockComponent, {
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



  //delete tyre
  deleteTyreStock(stock) {
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
