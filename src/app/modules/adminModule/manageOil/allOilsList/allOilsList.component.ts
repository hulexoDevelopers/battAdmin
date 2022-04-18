import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { oilService } from './../../../shared/services/oil.service';
import { editOilComponent } from './../../../shared/popups/oilModule/editOil/editOIl.component';


@Component({
  templateUrl: './allOilsList.component.html',
  styleUrls: ['./allOilsList.component.scss'],
})


export class allOilsListComponent implements OnInit {

  itemPerPage = 5;
  page = 1;
  allOils;
  isLoad: boolean = false;
  constructor(
    private resourceService: resourceService,
    private oilService: oilService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
  }



  ngOnInit() {
    this.getAllOilsList();

  }







  //get all oils list
  getAllOilsList() {
    this.oilService.getAllOilsWithCompanies().subscribe(res => {
      this.allOils = res.data;
      this.isLoad = true;
    })
  }



  //edit oil
  editOil(oilId: string): void {
    const dialogRef = this.dialog.open(editOilComponent, {
      data: oilId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllOilsList();
      }
    });
  }




  //delete oil
  deleteOil(oilId: string) {
    this.confirmationDelete(oilId);
  }

  //confirm delete oil
  confirmDelete(oilId: string) {
    this.oilService.deleteOil(oilId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllOilsList();

      }
    })
  }



  confirmationDelete(catId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.confirmDelete(catId);
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
