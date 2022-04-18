import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { orderService } from './../../shared/services/order.service';
import * as moment from 'moment';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { statsService } from './../../shared/services/stats.service';
import { inquiryService } from './../../shared/services/enquiry.service';

@Component({
  templateUrl: './mainPanel.component.html',
  styleUrls: ['./mainPanel.component.scss'],
})
export class mainPanelComponent implements OnInit {
  allInquiries;
  totalInquiries = 0;
  open = 0;
  close = 0;
  pending = 0;
  inProcess = 0;
  rejected = 0;
  date;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: orderService,
    private statsService: statsService,
    private inquiryService: inquiryService,
    public data: Data


  ) {


  }

  ngOnInit() {
    this.getAllInquiries()
  }


  getAllInquiries() {
    this.inquiryService.getAllEnquiries().subscribe(res => {
      this.allInquiries = res.data;
      this.totalInquiries = res.data.length;
      this.open = res.data.filter(data => data.inquiryStatus == 'Open').length;
      this.close = res.data.filter(data => data.orderStatus == 'completed').length;
      this.inProcess = res.data.filter(data => data.orderStatus == 'In Process' || data.orderStatus == 'Assigned').length;
      this.rejected = res.data.filter(data => data.inquiryStatus == 'Non Business Call' || data.inquiryStatus == 'Rejected').length;
    })
  }

  dateChange() {
    this.allInquiries = [];
    this.totalInquiries = 0;
    this.open = 0;
    this.close = 0;
    this.inProcess = 0;
    this.rejected = 0;
    this.inquiryService.getEnquiriesByDate(this.date).subscribe(res => {
      this.allInquiries = res.data;
      this.totalInquiries = res.data.length;
      this.open = res.data.filter(data => data.inquiryStatus == 'Open').length;
      this.close = res.data.filter(data => data.orderStatus == 'completed').length;
      this.inProcess = res.data.filter(data => data.orderStatus == 'In Process' || data.orderStatus == 'Assigned').length;
      this.rejected = res.data.filter(data => data.inquiryStatus == 'Non Business Call' || data.inquiryStatus == 'Rejected').length;
    })
  }

}
