import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { vehicleModel } from '../models/vehicle';
import { vehicleService } from '../services/vehicleService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import { addNewBrandComponent } from './../../../shared/popups/vehicleModule/addNewBrand/addNewBrand.component';
import { brandService } from './../../../shared/services/brand.service';
import { editBrandComponent } from 'src/app/modules/shared/popups/vehicleModule/editBrand/editBrand.component';

import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';


@Component({
  templateUrl: './vehicleBrands.component.html',
  styleUrls: ['./vehicleBrands.component.scss'],
})
export class vehicleBrandsComponent implements OnInit {

  vehicle = new vehicleModel();
  isDisabled: boolean = false;

  allBrands;

  itemPerPage = 10;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: vehicleService,
    private brandService: brandService,
    private searchConfigService: searchConfigService,
    private resourceService: resourceService,
    public dialog: MatDialog,
    private alert: alert,
    private data: Data

  ) {

  }



  ngOnInit() {
    this.allBrands = this.resourceService.allVehicleBrands
    this.getAllBrandsList() //get all brands list
  }


  //get all vehicles brands
  getAllBrandsList() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.allBrands = res.data;
     
    })
  }



  //add new brand
  addNewBrand(): void {
    const dialogRef = this.dialog.open(addNewBrandComponent, {
      width: "400px"
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBrandsList();
      }
    });
  }



  //edit brand
  editBrand(brandId: string): void {
    const dialogRef = this.dialog.open(editBrandComponent, {
      data: brandId,
      width: "400px"
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBrandsList();
      }
    });
  }




  //delete brand
  deleteBrand(brandId: string) {
    this.confirmationDelete(brandId);
  }

  //confirm delete plan
  confirmDelete(brandId: string) {
    this.brandService.deleteBrand(brandId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllBrandsList();
      }
    })
  }



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
