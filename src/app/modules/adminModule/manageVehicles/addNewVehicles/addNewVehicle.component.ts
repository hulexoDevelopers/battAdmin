import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { vehicleModel } from '../models/vehicle';
import { vehicleService } from '../services/vehicleService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { brandService } from './../../../shared/services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { addNewBrandComponent } from './../../../shared/popups/vehicleModule/addNewBrand/addNewBrand.component';
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
  templateUrl: './addNewVehicle.component.html',
  styleUrls: ['./addNewVehicle.component.scss'],
})
export class addNewVehicleComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  vehicle = new vehicleModel();
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

  itemPerPage = 5;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: vehicleService,
    private brandService: brandService,
    private batteryService: batteryService,
    private oilService: oilService,
    private tyreService: tyreService,
    private searchConfigService: searchConfigService,
    private UserInfoService: UserInfoService,
    public resourceService: resourceService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
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
  getAllBrandsList(val: boolean = false) {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.allBrands = res.data;
      if (val) {
        this.vehicle.brandId = res.data[0]._id;
        this.brand = res.data[0];
      }
      this.getAllVehicleList();
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
      // this.allVehicles = res.data.filter(o1 => this.allBrands.some(o2 => o1.companyId === o2._id));
      // this.isLoad = true;
    })
  }

  brandChange(ev) {
    this.vehicle.brandId = ev.value._id;
  }


  batteryChange(ev) {
    this.batteries = ev.value;
    // let btry: btry[] = []
    let btry = []
    for (let i = 0; i < this.batteries.length; i++) {
      btry.push(
        this.batteries[i]._id        // title: this.batteries[i].title
      )
    }
    this.selectedBatteries = btry;
  }


  oilChange(ev) {
    this.oiles = ev.value;
    let oils = []
    for (let i = 0; i < this.oiles.length; i++) {
      oils.push(
        this.oiles[i]._id
      )
    }
    this.selectedOil = oils;
  }


  tyreChange(ev) {
    this.tyres = ev.value;
    let tyres = []
    for (let i = 0; i < this.tyres.length; i++) {
      tyres.push(
        this.tyres[i]._id
      )
    }
    this.selectedTyres = tyres;
  }


  lowerCase() {
    this.vehicle.title = this.vehicle.title.toLowerCase().trim();
  }







  //add new brand
  addNewBrand(): void {
    const dialogRef = this.dialog.open(addNewBrandComponent, {
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBrandsList(true);
      }
    });
  }



  saveNewVehicle() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload brand only
      this.addNewVehicle();
    }
  }



  addNewVehicle() {
    this.vehicle.userId = this.UserInfoService.getAuthData();
    this.vehicle.batteries = this.selectedBatteries;
    this.vehicle.oils = this.selectedOil;
    this.vehicle.tyres = this.selectedTyres;
    this.disabled = true;

    this.vehicleService.addNewVehicle(this.vehicle).subscribe(res => {
      if (!res.success) {
        this.alert.actionResponse(res.message, 'error');
        // this.data.onRefresh();
        this.disabled = false;
        return;
      } else {
        this.getAllVehicleList();
        this.alert.actionResponse(res.message, 'success');
        this.vehicle.imageUrl = ''
        this.myInputVariable.nativeElement.value = ''
        this.image = '';
        this.imagePreview = '';
        document.getElementById('cancelBtn').click();
        this.myInputVariable.nativeElement.value = ''
        this.disabled = false;
        // this.companyUser = res.data
        // this.saveCompanyProfile();
      }
    })

  }





  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    this.image = this.form.value.image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    this.image = this.form.value.image
    this.validImage();
    this.ValidImageSize();



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      this.vehicle.imageUrl = res.url;
      this.addNewVehicle(); //now saving new vehicle;
    })

    //  let id = this.packageDetailData._id
    // this.planService.upLoadImage(id, this.form.value.image)
    //   .subscribe(res => {
    //     this.alert.responseAlert("Plan created sccessfully", 'success');
    //     this.data.onRefresh();

    //})

  }

  validFile
  invalidType
  inValidImage
  validImage() {

    if (this.image.type === 'image/jpeg' ||
      this.image.type === 'image/png' ||
      this.image.type === 'image/jpg' ||
      this.image.type === 'image/svg') {
    } else {
      this.alert.responseAlert("Image is not valid", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
    }

  }


  ValidImageSize() {
    if (this.image.size > 200000) {
      this.alert.responseAlert("Image is too large", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
      return;
    }
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
