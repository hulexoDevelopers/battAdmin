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
import { SocService } from './../../../shared/services/soc.service';




@Component({
  templateUrl: './inquiriesList.component.html',
  styleUrls: ['./inquiriesList.component.scss'],
})
export class allInquiriesListComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  isDisabled: boolean = false;
  globalSearch
  allInquiries;
  inquiries;

  itemPerPage = 25;
  page = 1;
  allUsers;
  date
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inquiryService: inquiryService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    private SocService: SocService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.userService.getAllUsers().subscribe(res => {
      this.allUsers = res.data;
      this.getAllInquiryList();
    })
    this.getUserData();
  }



  ngOnInit() {

    this.SocService.on('updateActiveJobs').subscribe(res => {
      this.getAllInquiryList();
    })

    this.SocService.on('refreshJobs').subscribe(res => {
      this.getAllInquiryList();
    })

    this.SocService.on('newInquiryRcvd').subscribe(res => {
      this.getAllInquiryList();
    })
  }

  getUserName(id: string) {
    const user = this.allUsers.find(data => data._id == id);
    if (user) {
      return user.firstName + ' ' + user.lastName
    } else {
      return 'Na'
    }
  }

  //get all inquiry list
  getAllInquiryList() {
    this.inquiryService.getAllEnquiries().subscribe(res => {
      this.allInquiries = res.data;
      this.inquiries = res.data;
    })
  }


  userData;
  //get user data 
  getUserData() {
    let userId = this.UserInfoService.getAuthData();
    this.userService.getUserById(userId).subscribe(res => {
      this.userData = res.data;
      this.getAllInquiryList();
    })
  }


  statusChange(ev) {
    let value = ev.target.value;
    if (value == 'all') {
      this.allInquiries = this.inquiries;
    } else if (value == 'open') {
      this.allInquiries = this.inquiries.filter(data => data.inquiryStatus == 'Open');
    } else if (value == 'close') {
      this.allInquiries = this.inquiries.filter(data => data.inquiryStatus == 'Close');
    }
  }


  serviceType(ev) {
    let value = ev.target.value;
    if (value == 'all') {
      this.allInquiries = this.inquiries;
    } else {
      this.allInquiries = this.inquiries.filter(data => data.orderStatus.toLowerCase() == value.toLowerCase());
    }
  }


  dateChange() {
    this.allInquiries = [];
  
    this.inquiryService.getEnquiriesByDate(this.date).subscribe(res => {
      this.allInquiries = res.data;
    })
  }

}
