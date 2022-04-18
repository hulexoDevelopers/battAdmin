import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from '../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { shareModalService } from './../../../shared/services/Modals.service';
import { companyService } from './../../../shared/services/company.service';
import { addNewCompanyComponent } from './../../../shared/popups/companyModule/addNewCompany/addNewCompany.component';
import { editCompanyComponent } from 'src/app/modules/shared/popups/companyModule/editCompany/editCompany.component';


@Component({
  templateUrl: './oilCompanies.component.html',
  styleUrls: ['./oilCompanies.component.scss'],
})
export class oilCompaniesComponent implements OnInit {

  isDisabled: boolean = false;
  allcompanies;
  itemPerPage = 5;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: companyService,
    private searchConfigService: searchConfigService,
    private resourceService: resourceService,
    private shareModalService: shareModalService,
    public dialog: MatDialog,
    private alert: alert,
    private data: Data

  ) {

  }



  ngOnInit() {
    if (this.resourceService.allCompanies) {
      this.allcompanies = this.resourceService.allCompanies.filter(data => data.tyre == 'oil');
    }

    this.getAllCompanies(); //get all battery companies
  }


  //get all companies
  getAllCompanies() {
    this.companyService.getAllCompanysList().subscribe(res => {
      this.allcompanies = res.data.filter(data => data.type == 'oil');
    })
  }



  //add new company
  addNewcompany(): void {
    // console.log('value' + value)
    const dialogRef = this.dialog.open(addNewCompanyComponent, {
      data: 'oil'
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCompanies();
      }
    });
  }



  //edit company
  editCompany(companyId: string): void {
    const dialogRef = this.dialog.open(editCompanyComponent, {
      data: companyId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCompanies();
      }
    });
  }




  //delete company
  deleteCompany(companyId: string) {
    this.confirmationDelete(companyId);
  }

  //confirm delete plan
  confirmDelete(companyId: string) {
    this.companyService.deleteCompany(companyId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllCompanies();

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
