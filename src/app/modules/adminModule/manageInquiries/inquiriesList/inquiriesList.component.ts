import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { inquiryModel } from '../models/inquiry';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { brandService } from './../../../shared/services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { resourceService } from './../../../shared/services/reource.service';
import { userService } from '../../../shared/services/user.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { inquiryService } from './../../../shared/services/enquiry.service';
import { customerModel } from '../../manageCustomers/models/customer';



@Component({
  templateUrl: './inquiriesList.component.html',
  styleUrls: ['./inquiriesList.component.scss'],
})
export class allInquiriesListComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  isDisabled: boolean = false;

  allInquiries;


  itemPerPage = 100;
  page = 1;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inquiryService: inquiryService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {
    this.getAllInquiryList();
  }



  //get all inquiry list
  getAllInquiryList() {
    this.inquiryService.getAllEnquiries().subscribe(res => {
      this.allInquiries = res.data;
    })
  }





}
