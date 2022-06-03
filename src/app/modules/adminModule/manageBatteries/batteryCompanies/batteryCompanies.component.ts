import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from '../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { batteryCompanyService } from './../../../shared/services/batteryCompany.service';
import { addNewBatteryCompanyComponent } from './../../../shared/popups/batteryModule/addNewBatteryCompany/addNewBatteryCompany.component';
import { editBatteryCompanyComponent } from './../../../shared/popups/batteryModule/editBatteryCompany/editBatteryCompany.component';
import { resourceService } from './../../../shared/services/reource.service';
import { shareModalService } from './../../../shared/services/Modals.service';


@Component({
  templateUrl: './batteryCompanies.component.html',
  styleUrls: ['./batteryCompanies.component.scss'],
})
export class batteryCompaniesComponent implements OnInit {

  isDisabled: boolean = false;

  allcompanies;

  itemPerPage = 100;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batteryCompanyService: batteryCompanyService,
    private searchConfigService: searchConfigService,
    private resourceService: resourceService,
    private shareModalService: shareModalService,
    public dialog: MatDialog,
    private alert: alert,
    private data: Data

  ) {

  }



  ngOnInit() {
    this.allcompanies = this.resourceService.allBatteryBrands;
    this.getAllBatteryCompanies(); //get all battery companies
  }


  //get all battery companies
  getAllBatteryCompanies() {
    this.batteryCompanyService.getAllBatteryCompanysList().subscribe(res => {
      this.allcompanies = res.data;
    })
  }



  //add new company
  addNewcompany(): void {
    // console.log('value' + value)
    const dialogRef = this.dialog.open(addNewBatteryCompanyComponent, {
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBatteryCompanies();
      }
    });
  }



  //edit company
  editCompany(companyId: string): void {
    const dialogRef = this.dialog.open(editBatteryCompanyComponent, {
      data: companyId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBatteryCompanies();
      }
    });
  }




  //delete company
  deleteCompany(companyId: string) {
    this.confirmationDelete(companyId);
  }

  //confirm delete plan
  confirmDelete(companyId: string) {
    this.batteryCompanyService.deleteBatteryCompany(companyId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllBatteryCompanies();

      }
    })
  }


  //confirm delete
  confirmationDelete(catId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
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
