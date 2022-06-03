import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { batteryModel } from '../models/battery';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { batteryService } from './../../../shared/services/battery.service';
import { batteryCompanyService } from './../../../shared/services/batteryCompany.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { imageService } from './../../../shared/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { editBatteryComponent } from './../../../shared/popups/batteryModule/editBattery/editBattery.component';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';


@Component({
  templateUrl: './allBatteriesList.component.html',
  styleUrls: ['./allBatteriesList.component.scss'],
})


export class allBatteriesListComponent implements OnInit {



  allBrands;
  allBatteries;
  brandConfig;
  brand = null;
  isCompany: boolean = false;
  isSubmitted: boolean = false;

  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  itemPerPage = 100;
  page = 1;

  isLoad: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batteryService: batteryService,
    private batteryCompanyService: batteryCompanyService,
    private searchConfigService: searchConfigService,
    private resourceService: resourceService,
    private UserInfoService: UserInfoService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.resourceService.loadData();
    this.brandConfig = this.searchConfigService.companyConfig;
    this.allBrands = this.resourceService.allBatteryBrands;
    this.allBatteries = this.resourceService.allBatteries;
  }



  ngOnInit() {
    this.getAllCompaniesList();
    // this.form = new FormGroup({
    //   title: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   content: new FormControl(null, { validators: [Validators.required] }),
    //   image: new FormControl(null, {
    //     validators: [Validators.required],
    //     // asyncValidators: [mimeType]
    //   })
    // });
  }







  //get all companies list
  getAllCompaniesList() {
    this.batteryCompanyService.getAllBatteryCompanysList().subscribe(res => {
      this.allBrands = res.data;
      this.getAllBatteriesList();
    })
  }


  //get all batteries lise
  getAllBatteriesList() {
    this.batteryService.getAllBatteriesList().subscribe(res => {
      this.allBatteries = res.data;
      // this.allBatteries = res.data.filter(o1 => this.allBrands.some(o2 => o1.companyId === o2._id));
      this.isLoad = true;
    })
  }







  //get company title
  getCompanyTitle(id: string) {
    let company = this.allBrands.find(data => data._id == id);
    if (company) {
      return company.title;
    } else {
      return '--'
    }

  }


  //edit battery
  editBattery(batteryId: string): void {
    const dialogRef = this.dialog.open(editBatteryComponent, {
      data: batteryId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBatteriesList();
      }
    });
  }




  //delete batery
  deleteBattery(batteryId: string) {
    this.confirmationDelete(batteryId);
  }

  //confirm delete battery
  confirmDelete(batteryId: string) {
    this.batteryService.deleteBattery(batteryId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllBatteriesList();

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
