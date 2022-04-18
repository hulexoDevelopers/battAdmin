import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { brandService } from './../../../services/brand.service';
import { imageService } from './../../../services/image.service';
import { batteryService } from './../../../services/battery.service';
import { vehicleModel } from '../../../../adminModule/manageVehicles/models/vehicle';
import { vehicleService } from './../../../../adminModule/manageVehicles/services/vehicleService';
import { searchConfigService } from './../../../../shared/services/search.config';
import { resourceService } from './../../../services/reource.service';
import { oilService } from './../../../services/oil.service';
import { tyreService } from './../../../services/tyre.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editVehicle',
  templateUrl: './editVehicle.component.html',
  styleUrls: ['./editVehicle.component.scss']
})
export class editVehicleComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  vehicle = new vehicleModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  vehicleId: string;

  allBrands;
  brandConfig;
  brand;
  allBatteries;
  batteries = [];
  selectedBatteries = [];


  allOils;
  oils = [];
  selectedOils = [];


  allTyres;
  tyres = [];
  selectedTyres = [];

  isLoad: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editVehicleComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private searchConfigService: searchConfigService,
    private resourceService: resourceService,
    private brandService: brandService,
    private batteryService: batteryService,
    private oilService: oilService,
    private tyreService: tyreService,
    private vehicleService: vehicleService,
    private alert: alert,
    // private userService: userService
  ) {
    this.brandConfig = this.searchConfigService.brandConfig;
    this.allBrands = this.resourceService.allVehicleBrands;
    this.allBatteries = this.resourceService.allBatteries;
    this.allOils = this.resourceService.alloils;
    this.allTyres = this.resourceService.allTyres;
    this.vehicleId = data;
    if (this.vehicleId) {
      this.getAllBrandsList();
      this.getAllBatteriesList();
      this.getAllTyresList();
      this.getAllOilsList();
      this.getVehicleById();
    } else {
      this.onClose();
    }

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
    this.oils = ev.value;
    // let btry: btry[] = []
    let oils = []
    for (let i = 0; i < this.oils.length; i++) {
      oils.push(
        this.oils[i]._id        // title: this.batteries[i].title
      )
    }
    this.selectedOils = oils;
  }


  tyreChange(ev) {
    this.tyres = ev.value;
    // let btry: btry[] = []
    let tyres = []
    for (let i = 0; i < this.tyres.length; i++) {
      tyres.push(
        this.tyres[i]._id        // title: this.batteries[i].title
      )
    }
    this.selectedTyres = tyres;
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
      // console.log('all batteries' + JSON.stringify(this.allBatteries))
    })
  }


  //get all oils list
  getAllOilsList() {
    this.oilService.getAllOilsList().subscribe(res => {
      this.allOils = res.data;
      // console.log('all batteries' + JSON.stringify(this.allBatteries))
    })
  }


  //get all tyres list
  getAllTyresList() {
    this.tyreService.getAllTyresList().subscribe(res => {
      this.allTyres = res.data;
      // console.log('all batteries' + JSON.stringify(this.allBatteries))
    })
  }


  //get vehicle data with id
  getVehicleById() {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe(res => {
      this.vehicle.title = res.data.title;
      this.vehicle.brandId = res.data.brandId;
      this.brand = this.allBrands.find(data => data._id == this.vehicle.brandId);
      for (let i = 0; i < res.data.batteries.length; i++) {
        let btry = this.allBatteries.find(data => data._id == res.data.batteries[i]);
        if (btry) {
          this.batteries.push(btry);
          this.selectedBatteries.push(btry._id)
        }

      }

      for (let i = 0; i < res.data.oils.length; i++) {
        let oil = this.allOils.find(data => data._id == res.data.oils[i]);
        if (oil) {
          this.oils.push(oil);
          this.selectedOils.push(oil._id)
        }

      }

      for (let i = 0; i < res.data.tyres.length; i++) {
        let tyre = this.allTyres.find(data => data._id == res.data.tyres[i]);
        if (tyre) {
          this.tyres.push(tyre);
          this.selectedTyres.push(tyre._id)
        }

      }

      this.isLoad = true;
      // this.battery.detail = res.data.detail;
      // this.battery.batteryId = res.data.batteryId;
      // this.brand.brandId = res.data.brandId
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.vehicle.imageUrl = res.data.imageUrl;
        this.imagePreview = res.data.imageUrl;
      }
    })
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
  }


  updateVehicle() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload vehicle only
      this.updateVehicleData()
    }
  }


  //update vehicle data 
  updateVehicleData() {
    this.vehicle.userId = this.userInfoService.getAuthData();
    this.vehicle.title = this.vehicle.title.trim().toLowerCase();
    this.vehicle.batteries = this.selectedBatteries;
    this.vehicle.oils = this.selectedOils;
    this.vehicle.tyres = this.selectedTyres;
    if (!this.vehicle.title) {
      return;
    }

    // this.battery.detail = res.data.detail;

    this.vehicleService.updateVehicle(this.vehicleId, this.vehicle).subscribe(res => {
      if (res.success) {
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
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

    // if (this.image.size > 200000) {
    //   this.alert.responseAlert("Image is too large", 'error');
    //   this.image = ''
    //   this.imagePreview = ''
    //   this.myInputVariable.nativeElement.value = "";
    //   return;
    // }
    this.validImage();
    this.ValidImageSize();

    this.editImage = true;



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      this.vehicle.imageUrl = res.url;
      this.updateVehicleData(); //now saving vehicle data;
    })

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

}
