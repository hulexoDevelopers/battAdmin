import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { tyreService } from './../../../shared/services/tyre.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { editTyreComponent } from 'src/app/modules/shared/popups/tyreModule/editTyre/editTyre.component';


@Component({
  templateUrl: './allTyresList.component.html',
  styleUrls: ['./allTyresList.component.scss'],
})


export class allTyresListComponent implements OnInit {

  itemPerPage = 100;
  page = 1;
  allTyres

  isLoad: boolean = false;
  constructor(
    private resourceService: resourceService,
    private tyreService: tyreService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
  }



  ngOnInit() {
    this.getAllTyresList();

  }







  //get all tyres list
  getAllTyresList() {
    this.tyreService.getAllTyresWithCompanies().subscribe(res => {
      this.allTyres = res.data;
      this.isLoad = true;
    })
  }



  //edit tyre
  editTyre(tyreId: string): void {
    const dialogRef = this.dialog.open(editTyreComponent, {
      data: tyreId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTyresList();
      }
    });
  }




  //delete tyre
  deleteTyre(tyreId: string) {
    this.confirmationDelete(tyreId);
  }

  //confirm delete tyre
  confirmDelete(tyreId: string) {
    this.tyreService.deleteTyre(tyreId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllTyresList();

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
