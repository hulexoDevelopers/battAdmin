import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { MatDialog } from '@angular/material/dialog';
import { resourceService } from './../../../shared/services/reource.service';
import { userService } from '../../../shared/services/user.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { inquiryService } from './../../../shared/services/enquiry.service';
import { batteryService } from './../../../shared/services/battery.service';
import { batteryStockService } from './../../../shared/services/batteryStock.service';
import { jobService } from './../../../shared/services/job.service';
import { vehicleService } from './../../../adminModule/manageVehicles/services/vehicleService';
import { SocService } from './../../../shared/services/soc.service';
import { tyreService } from './../../../shared/services/tyre.service';
import { oilService } from './../../../shared/services/oil.service';
import { tyreStockService } from './../../../shared/services/tyreStock.service';
import { oilStockService } from './../../../shared/services/oilStock.service';

@Component({
  templateUrl: './inquiryDetail.component.html',
  styleUrls: ['./inquiryDetail.component.scss'],
})
export class inquiryDetailComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  isDisabled: boolean = false;
  isDataLoad: boolean = false;
  allInquiries;
  itemPerPage = 100;
  page = 1;
  allUsers;
  inqId;
  inqData;
  technicianList;
  allTechnicians = [];
  allVehicles;

  availableBatteryStock;
  availableTyreStock;
  availableOilStock;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inquiryService: inquiryService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    private batteryService: batteryService,
    private batteryStockService: batteryStockService,
    private tyreStockService: tyreStockService,
    private oilStockService: oilStockService,
    private tyreService: tyreService,
    private oilService: oilService,
    private resourceService: resourceService,
    private jobService: jobService,
    public dialog: MatDialog,
    private vehicleService: vehicleService,
    private SocService: SocService,
    private alert: alert,
    public data: Data

  ) {
    
    // this.getAllVehicles();
  }

  

  loadInitalData() {
    this.allVehicles = this.resourceService.allVehicles;
    this.userService.getTechniciansWithActiveJobs().subscribe(res => {
      this.technicianList = res.data;
      this.allTechnicians = res.data;
    })
    this.getUserData(); //make this function in resource service and share in every components
    this.getParamsId();
    this.getAllJobs();
    this.isDataLoad = true;
  }

  //get vehicle title
  getVehicle(id: string) {
    let vehicles = this.resourceService.allVehicles;
    let veh = vehicles.find(data => data._id == id);
    if (veh) {
      return veh.title
    } else {
      return 'NA'
    }
  }

  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.inqId = params.id;
        if (!this.inqId) {
          this.data.goBack();
          return;
        } else {
          // this.getTechnicianDetail(this.techId) //get tech detail
          this.getEnquiryDetail(this.inqId) // get tech stock detail
          this.getInquiryJobsWithTechnicianDetail(this.inqId) // get all inquiry jobs with detail
        }
      }
    });
  }



  //get inquiry  detail
  getEnquiryDetail(id: string) {
    this.inquiryService.getEnquiryById(id).subscribe(res => {
      this.inqData = res.data;
      this.sortTechArray();
      if (this.inqData.serviceDetail[0].serviceType == 'Battery Change' && this.inqData.serviceDetail[0].isBattery) {
        this.getBatteryById(this.inqData.serviceDetail[0].battery)
      }

      if (this.inqData.serviceDetail[0].serviceType == 'Tyre Change' && this.inqData.serviceDetail[0].isTyre) {
        this.getTyreById(this.inqData.serviceDetail[0].tyre)
      }

      if (this.inqData.serviceDetail[0].serviceType == 'Oil Change' && this.inqData.serviceDetail[0].isOil) {
        this.getOilById(this.inqData.serviceDetail[0].oil)
      }
    })
  }

  isBatteryStock: boolean = false;
  //get battery available assign stock
  getBatteryAvaialbeAssignStock(id: string) {
    this.batteryStockService.getBatteryAvaialbeAssignStock(id).subscribe(res => {
      if (res.success) {
        this.availableBatteryStock = res.data;
        this.isBatteryStock = true;

      }
    })
  }


  isTyreStock: boolean = false;
  //get tyre available assign stock
  getTyreAvaialbeAssignStock(id: string) {
    this.tyreStockService.getTyreAvaialbeAssignStock(id).subscribe(res => {
      if (res.success) {
        this.availableTyreStock = res.data;
        this.isTyreStock = true;

      }
    })
  }


  isOilStock: boolean = false;
  //get tyre available assign stock
  getOilAvaialbeAssignStock(id: string) {
    this.oilStockService.getOilAvaialbeAssignStock(id).subscribe(res => {
      if (res.success) {
        this.availableOilStock = res.data;
        this.isOilStock = true;

      }
    })
  }


  getTechTotalStock(id) {
    let availableStock = 0;
    let stock = this.availableBatteryStock.filter((data: any) => data.techId == id);
    if (stock.length > 0) {
      for (let i = 0; i < stock.length; i++) {
        availableStock += stock[i].totalAssign - stock[i].totalSale;
      }
    }
    return availableStock;
  }


  getTechTotalOilStock(id) {
    let availableStock = 0;
    console.log('avaialble oil stock' + JSON.stringify(this.availableOilStock))
    let stock = this.availableOilStock.filter((data: any) => data.techId == id);
    if (stock.length > 0) {
      for (let i = 0; i < stock.length; i++) {
        availableStock += stock[i].totalAssign - stock[i].totalSale;
      }
    }
    return availableStock;
  }


  getTechTotalTyreStock(id) {
    let availableStock = 0;
    let stock = this.availableTyreStock.filter((data: any) => data.techId == id);
    if (stock.length > 0) {
      for (let i = 0; i < stock.length; i++) {
        availableStock += stock[i].totalAssign - stock[i].totalSale;
      }
    }
    return availableStock;
  }


  //sort users distance base
  sortTechArray() {
    for (let i = 0; i < this.allTechnicians.length; i++) {
      // const user = this.allUsers.find(data => data._id == this.batteryStock[i].techId);
      let distance = this.data.getDistanceFromLatLonInKm(this.allTechnicians[i].data[0].lat, this.allTechnicians[i].data[0].long, this.inqData.address[0].lat, this.inqData.address[0].long)
      this.allTechnicians[i].distance = distance;
      // this.batteryStock[i].totalJobs = this.batteryStock[i].jobs.length;
    }



    // console.log('bs' + JSON.stringify(this.batteryStock))
    this.allTechnicians.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    this.isLoad = true;
  }



  ngOnInit() {
    this.loadInitalData() //load initial data;

  }

  // ngOnChanges(){
  //   console.log('on cahnges call')
  // }

  // ngDoCheck(){
  //   console.log('do check hit')
  // }

  ngAfterViewInit(){
    // console.log('after check init')
    this.loadInitalData() //load initial data;
  }	

  // viewWillEnter(){
  //   console.log('view will enter')
  // }

  getUserName(id: string) {
    const user = this.allTechnicians.find(data => data._id == id);
    if (user) {
      return user.firstName + ' ' + user.lastName
    } else {
      return 'Na'
    }
  }


  userData;
  //get user data 
  getUserData() {
    let userId = this.UserInfoService.getAuthData();
    this.userService.getUserById(userId).subscribe(res => {
      this.userData = res.data
    })
  }

  batteryData;
  //get battery by id
  getBatteryById(id) {
    this.batteryService.getBatteryById(id).subscribe(res => {
      this.batteryData = res.data;
      this.getBatteryAvaialbeAssignStock(id);
    })
  }

  tyreData;
  //get tyre by id
  getTyreById(id) {
    this.tyreService.getTyreById(id).subscribe(res => {
      this.tyreData = res.data;
      this.getTyreAvaialbeAssignStock(id);
    })
  }


  oilData;
  //get oil by id
  getOilById(id) {
    this.oilService.getOilById(id).subscribe(res => {
      this.oilData = res.data;
      this.getOilAvaialbeAssignStock(id);
    })
  }



  isLoad: boolean = false;
  batteryStock;
  //get battery stock
  getBatteryStockDetail(id) {
    this.batteryStockService.getBatteryTechnicianWithJobs(id).subscribe(res => {
      this.batteryStock = res.data.filter(data => data.totalAssign > 0);
      let users = [];
      for (let i = 0; i < this.batteryStock.length; i++) {
        if (this.getUserLocation(this.batteryStock[i].techId) != 'Na') {
          users.push(this.batteryStock[i])

        }
      }
      this.batteryStock = users;
      // this.sortUsersArray();
    })
  }


  getUserLocation(id: string) {
    const user = this.allTechnicians.find(data => data._id == id);
    if (user.data[0]) {
      return user
    } else {
      return 'Na'
    }
  }


  getLongLat(id) {
    const user = this.allUsers.find(data => data._id == id);
    if (user.data[0]) {
      return user.data[0].lat + ',' + user.data[0].long
    } else {
      return 'Na'
    }
  }

  //get user Location 











  assignJob(techId: string) {

    let data = {
      userId: this.UserInfoService.getAuthData(),
      agentName: this.userData.firstName + ' ' + this.userData.lastName,
      inquiryId: this.inqData._id,
      serviceType: this.inqData.serviceType,
      inquiryDetailId: this.inqData._id,
      techId: techId
    }

    this.jobService.addNewJob(data).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        this.inqData.inquiryStatus = 'Close';
        this.inqData.orderStatus = 'In Process';

        let notifData = {
          inquiryId: this.inqData.inquiryId,
          customerId: this.inqData.customerId,
          technicianId: techId,
          technicianName: this.getUserName(techId),
          title: 'Job Assigned'
        }

        this.SocService.emit('assignJob', notifData);
        this.inquiryService.updateEnquiry(this.inqData._id, this.inqData).subscribe(res => {
          this.data.goBack();
        })
        this.data.onRefresh();
        // this.getAllCustomersList();

      }
    })
  }

  inquiryJobs;
  //get all inquiry jobs with technician detail
  getInquiryJobsWithTechnicianDetail(iquiryId: string) {
    this.jobService.getInquiryJobsWithTechnicianDetail(iquiryId).subscribe(res => {
      this.inquiryJobs = res.data;
    })
  }


  allJobs;
  //get all job assign
  getAllJobs() {
    this.jobService.getAllJobs().subscribe(res => {
      this.allJobs = res.data;
    })
  }

  //get customer total jobs
  getJobs(techId) {
    let job = this.allJobs.filter(data => data.techId == techId);
    if (job) {
      return job.length
    } else {
      return 0
    }
  }


}
