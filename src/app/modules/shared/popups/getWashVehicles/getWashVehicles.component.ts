import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material";
// import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { brands } from '../../models/carBrand';
import * as decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../auth/userInfoService';
import { alert } from '../../services/sweetAlert.service';
import { brandService } from './../../services/brand.service';
import { imageService } from './../../services/image.service';
import { packageService } from './../../services/package.sercice';
import { Data } from './../../services/shareDataService';
import { vehicleService } from './../../../adminModule/manageVehicles/services/vehicleService';
import { searchConfigService } from './../../services/search.config';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-washVehicles',
  templateUrl: './getWashVehicles.component.html',
  styleUrls: ['./getWashVehicles.component.scss']
})
export class washVehiclesComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;


  allCarBrands;
  allVehicles;
  brandVehicles;
  disabled;
  brandConfig;

  brand;
  vehicle;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<washVehiclesComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private brandService: brandService,
    private vehicleService: vehicleService,
    private searchConfigService: searchConfigService,
    private alert: alert,
    private Data: Data,
    private packageService: packageService
    // private userService: userService
  ) {
    this.brandConfig = this.searchConfigService.brandConfig;
    this.getAllBrands();
    this.getAllVehiclesList();

  }


  //get all brands
  getAllBrands() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.allCarBrands = res.data;
    })
  }

  //get all vehicles list
  getAllVehiclesList() {
    this.vehicleService.getAllVehicleList().subscribe(res => {
      this.allVehicles = res.data;
    })
  }

  getBrandVehicles(brandId: string) {
    this.brandVehicles = this.allVehicles.filter(data => data.brandId == brandId);
  }

  sVehicle;
  getVehicle(ev) {
    this.sVehicle = ev.value;
  }

  ngOnInit() {

  }


  saveVehicle() {
    if (!this.sVehicle) {
      return;
    } this.dialogRef.close(this.sVehicle);
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
  }




}
