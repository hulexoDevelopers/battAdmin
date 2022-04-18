import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { orderService } from './../../shared/services/order.service';
import * as moment from 'moment';

import { data } from "./data-serires";
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { statsService } from './../../shared/services/stats.service';
import { inquiryService } from './../../shared/services/enquiry.service';
import { userService } from './../../userModule/services/userService';
import { SocService } from './../../shared/services/soc.service';

@Component({
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.scss'],
})
export class adminPanelComponent implements OnInit {

  totalInquiries = 0;
  completed = 0;
  totalCustomers = 0;
  allInquiries;

  itemPerPage = 25;
  page = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: orderService,
    private statsService: statsService,
    private inquiryService: inquiryService,
    private userService: userService,
    private SocService: SocService,
    private dataFun: Data

  ) {


  }

  ngOnInit() {
    this.getAllInquiries();
    this.getAllUsers();
    this.SocService.on('newInquiryRcvd').subscribe(res => {
      this.getAllInquiries();
      this.getAllUsers();
    })
  }

  getAllInquiries() {
    this.inquiryService.getAllEnquiries().subscribe(res => {
      this.allInquiries = res.data;
      this.totalInquiries = res.data.length;
      if (this.totalInquiries > 0) {
        let completed = res.data.filter(data => data.orderStatus == 'completed');
        if (completed.length) {
          this.completed = completed.length
        }
      }
      // this.totalInquiries = res.data.filter
    })
  }


  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      if (res.data.length > 0) {
        let users = res.data.filter(data => data.role == 'customer');
        if (users.length) {
          this.totalCustomers = users.length;
        }
      }

    })
  }

}
