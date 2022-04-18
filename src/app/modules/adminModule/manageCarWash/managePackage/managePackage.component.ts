import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { inquiryModel } from '../models/inquiry';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { userService } from '../../../shared/services/user.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { packageService } from './../../../shared/services/package.sercice';


export interface item {
  id: string;
  title: string;
  bronze: string;
  silver: string;
  gold: string;
}

@Component({
  templateUrl: './managePackage.component.html',
  styleUrls: ['./managePackage.component.scss'],
})
export class washPackageComponent implements OnInit {
  itemPerPage = 5;
  page = 1;


  myForm: FormGroup;
  serverData = [];

  packageData;
  packages;
  message;
  messageClass;
  item;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private userService: userService,
    private resourceService: resourceService,
    private searchConfigService: searchConfigService,
    private userInfoService: UserInfoService,
    private packageService: packageService,
    private alert: alert,
    public Data: Data,
    private _formBuilder: FormBuilder,
    private fb: FormBuilder,

  ) { }



  ngOnInit() {
    this.getAllPackages()
    this.myForm = this.fb.group({
      packageItems: this.fb.array([], [Validators.required])
    });


  }


  updatePackagePrice() {
    if (!this.myForm.valid) {
      this.message = "invalid fields";
      this.messageClass = "alert alert-danger";
      return;
    }
    let values = this.myForm.value;
    let data = {
      name: 'Main',
      packages: values.packageItems
    }

    this.packageService.updatepackage(this.packageData._id, data).subscribe(res => {
      this.message = res.message;
      this.messageClass = "alert alert-success"
    })
    this.Data.onRefresh()
  }

  get packageItems() {
    return this.myForm.get("packageItems") as FormArray;
  }

  getAllPackages() {
    this.packageService.getAllpackages().subscribe(res => {
      console.log('res' + JSON.stringify(res))
      this.packageData = res[0]
      this.serverData = res[0].packages

      console.log('package data' + JSON.stringify(this.serverData))
      this.data();
    })
  }



  private data() {
    this.serverData = this.packageData.packages
    this.serverData.map(d =>
      this.packageItems.push(this.fb.group({ id: d.id, title: d.title, bronze: d.bronze, silver: d.silver, gold: d.gold }))
    );
  }



  addCreds() {
    this.addMore()
    const creds = this.myForm.controls.packageItems as FormArray;
    creds.push(
      this.fb.group({
        id: this.Data.getRandomNumber(),
        title: '',
        bronze: '',
        silver: '',
        gold: ''
      })
    );
    // this.hideArray.push(false);
  }

  addMore() {
    console.log('server data' + JSON.stringify(this.serverData))

    this.serverData = this.serverData.concat({
      id: this.Data.getRandomNumber(),
      title: '',
      bronze: '',
      silver: '',
      gold: ''
    })
  }



  remove(num: item): void {
    this.item = num;
    this.confirmationDelete();
    return;



  }



  confirmationDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.delete()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your  file is safe :)',
        //   'error'
        // )
      }
    })
  }

  delete() {
    let num = this.item;
    const index = this.serverData.indexOf(num);
    if (index >= 0) {
      this.serverData.splice(index, 1);
      this.packageItems.removeAt(index)
    }
    this.updatePackagePrice();
  }

}
