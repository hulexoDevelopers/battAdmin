import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { vehicleService } from '../services/vehicleService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { brandService } from './../../../shared/services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { batteryService } from './../../../shared/services/battery.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { imageService } from './../../../shared/services/image.service';
import { editVehicleComponent } from 'src/app/modules/shared/popups/vehicleModule/editVehicle/editVehicle.component';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { oilService } from './../../../shared/services/oil.service';
import { tyreService } from './../../../shared/services/tyre.service';
export interface btry {
  _id: string;
  title: string
}


@Component({
  templateUrl: './allVehiclesList.component.html',
  styleUrls: ['./allVehiclesList.component.scss'],
})
export class allVehiclesListComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  isDisabled: boolean = false;

  allBrands;
  brandConfig;
  brand;

  allBatteries;
  batteries: any;

  selectedBatteries;

  allOils;
  oiles: any;
  selectedOil;

  allTyres;
  tyres: any;
  selectedTyres;

  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  allVehicles;

  itemPerPage = 100;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: vehicleService,
    private brandService: brandService,
    private batteryService: batteryService,
    private searchConfigService: searchConfigService,
    public resourceService: resourceService,
    private oilService: oilService,
    private tyreService: tyreService,
    private UserInfoService: UserInfoService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.allBatteries = this.resourceService.allBatteries;
    this.allBrands = this.resourceService.allVehicleBrands;
    this.allVehicles = this.resourceService.allVehicles;
    this.brandConfig = this.searchConfigService.brandConfig;
  }



  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      })
    });
    this.getAllBrandsList();
    this.getAllBatteriesList();
    this.getAllOilsList();
    this.getAllTyresList();
    this.getAllVehicleList();
  }


  //getVehicleBrand
  findBrandName(id: string) {
    let company = this.allBrands.find(data => data._id == id);
    if (company) {
      return company.title
    } else {
      return '--'
    }

  }


  //get btry name
  findBatteryName(id: string) {
    let btry = this.allBatteries.find(data => data._id == id);
    if (btry) {
      return btry.title
    } else {
      return ''
    }

  }


  //get oil name
  findOilName(id: string) {
    let oil = this.allOils.find(data => data._id == id);
    if (oil) {
      return oil.title
    } else {
      return ''
    }

  }



  //get tyre name
  findTyreName(id: string) {
    let tyre = this.allTyres.find(data => data._id == id);
    if (tyre) {
      return tyre.title
    } else {
      return ''
    }

  }


  //get all vehicle brands list
  getAllBrandsList() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.allBrands = res.data;
    })
  }

  //get all batteries list
  getAllBatteriesList() {
    this.batteryService.getAllBatteriesList().subscribe(res => {
      this.allBatteries = res.data;
    })
  }

  //get all oils list
  getAllOilsList() {
    this.oilService.getAllOilsList().subscribe(res => {
      this.allOils = res.data;
    })
  }


  //get all tyres list
  getAllTyresList() {
    this.tyreService.getAllTyresList().subscribe(res => {
      this.allTyres = res.data;
    })
  }

  //get all vehicle list
  getAllVehicleList() {
    this.vehicleService.getAllVehicleList().subscribe(res => {
      this.allVehicles = res.data;
    })
  }
















  //edit vehicle
  editVehicle(vehicleId: string): void {
    const dialogRef = this.dialog.open(editVehicleComponent, {
      data: vehicleId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllVehicleList();
      }
    });
  }





  //delete vehicle
  deleteVehicle(vehicleId: string) {
    this.confirmationDelete(vehicleId);
  }

  //confirm delete vehicle
  confirmDelete(vehicleId: string) {
    this.vehicleService.deleteVehicle(vehicleId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllVehicleList();

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
