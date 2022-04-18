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
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-packageDetail',
  templateUrl: './packageDetail.component.html',
  styleUrls: ['./packageDetail.component.scss']
})
export class packageDetailComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  selectedPackage;
  allowCars;
  packageData;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<packageDetailComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private brandService: brandService,
    private alert: alert,
    private Data: Data,
    private packageService: packageService
    // private userService: userService
  ) {
    this.getWashPackagedetail();
  }


  washPackage;
  //get wash package detail
  getWashPackagedetail() {
    this.packageService.getAllpackages().subscribe(res => {
      this.washPackage = res[0].packages;

      console.log('wash packages')

    })

  }


  ngOnInit() {

  }


  onClose() {
    this.dialogRef.close(false);
  }




}
