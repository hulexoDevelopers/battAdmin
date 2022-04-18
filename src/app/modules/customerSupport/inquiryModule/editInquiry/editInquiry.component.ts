
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
import { customerModel } from 'src/app/modules/adminModule/manageCustomers/models/customer';

import { washVehiclesComponent } from './../../../shared/popups/getWashVehicles/getWashVehicles.component';
import { packageDetailComponent } from './../../../shared/popups/packageDetail/packageDetail.component';
import { vehicleService } from './../../../adminModule/manageVehicles/services/vehicleService';
import { batteryService } from './../../../shared/services/battery.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { mapApiService, Maps } from './../../../shared/services/mapApi.service';
// import { geolib } from './../../../shared/services/geolib';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { SocService } from './../../../shared/services/soc.service';
import { tyreService } from './../../../shared/services/tyre.service';
import { oilService } from './../../../shared/services/oil.service';
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
}

export interface Vehicle {
  brandId: string;
  vehicleId: string;
  title: string;
}

export interface Battery {
  brandId: string;
  batteryId: string;
  title: string;
}

@Component({
  templateUrl: './editInquiry.component.html',
  styleUrls: ['./editInquiry.component.scss'],
})
export class editInquiryComponent implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;


  itemPerPage = 5;
  page = 1;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  inquiry = new inquiryModel();
  customer = new customerModel();
  isDisabled: boolean = false;
  isUser: boolean = false;
  userinfo: User;
  user = {} as User;
  allStates;
  offerServices = ['Battery Change', 'Car Wash', 'Oil Change', 'Tyre Change'];
  inqStatus = ['Closed', 'Open', 'Non Business Call', 'Rejected']
  vBrands;
  allVehicles;
  vehicles;
  allBatteriesList;
  allTyresList;
  allOilsList;
  // bBrands;
  // batteries;
  recomendedBatteries = [];
  recomendedTyres = [];
  recomendedOils = [];
  // vehicleDetail = {} as Vehicle;
  // batteryDetail = {} as Battery;
  selectedBrand;
  selectedVehicle;
  selectedBattery;
  selectedTyre;
  selectedOil;
  selectedpackage = null;
  brandConfig;
  vehicleConfig;

  registerCustomer;
  customerVehicles = [];

  updateUser: boolean = false;
  userData;

  today = new Date();
  googleAddress;
  priceQuoted;
  appointmentDate;

  inqId;
  inqData;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private userService: userService,
    private resourceService: resourceService,
    private searchConfigService: searchConfigService,
    private userInfoService: UserInfoService,
    private brandService: brandService,
    private vehicleService: vehicleService,
    private inquiryService: inquiryService,
    private batteryService: batteryService,
    private tyreService: tyreService,
    private oilService: oilService,
    private SocService: SocService,
    private alert: alert,
    public data: Data,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone

  ) {
    this.getParamsId();
    this.getuserById();
    this.getAllBrandsList();
    this.getAllBatteriesList();
    this.getAllOilsList();
    this.getAllTyresList();
    this.inquiry.inquiryId = this.data.getRandomNumber().toString();
    this.allStates = this.data.getAllStates();
    this.user.state = null;
    this.inquiry.serviceType = null;
    // this.vBrands = this.resourceService.allVehicleBrands;
    this.brandConfig = this.searchConfigService.brandConfig;
    this.vehicleConfig = this.searchConfigService.brandConfig;
    this.inquiry.inquiryStatus = 'Open'
    // this.
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
          // this.getInquiryJobsWithTechnicianDetail(this.inqId) // get all inquiry jobs with detail
        }
      }
    });
  }

  //get inquiry  detail
  getEnquiryDetail(id: string) {
    this.inquiryService.getEnquiryById(id).subscribe(res => {
      this.inqData = res.data;
      console.log('res' + JSON.stringify(res.data));
      this.inquiry = res.data;
      this.user.firstName = this.inqData.personalInfo.firstName
      this.user.lastName = this.inqData.personalInfo.lastName
      this.user.email = this.inqData.personalInfo.email;
      this.googleAddress = this.inqData.address[0].address;
      this.latitude = this.inqData.address[0].lat;
      this.longitude = this.inqData.address[0].long;
      this.setCurrentLocation();
      this.zoom = 12;
      // this.sortTechArray();
      // if (this.inqData.serviceDetail[0].serviceType == 'Battery Change' && this.inqData.serviceDetail[0].isBattery) {
      //   this.getBatteryById(this.inqData.serviceDetail[0].battery)
      // }

      // if (this.inqData.serviceDetail[0].serviceType == 'Tyre Change' && this.inqData.serviceDetail[0].isTyre) {
      //   this.getTyreById(this.inqData.serviceDetail[0].tyre)
      // }

      // if (this.inqData.serviceDetail[0].serviceType == 'Oil Change' && this.inqData.serviceDetail[0].isOil) {
      //   this.getOilById(this.inqData.serviceDetail[0].oil)
      // }
    })
  }

  //get all vehicle brands list
  getAllBrandsList() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.vBrands = res.data;
      this.getAllVehicleList();
    })
  }

  isVehicles: boolean = false;
  //get all vehicle list
  getAllVehicleList() {
    this.vehicleService.getAllVehicleList().subscribe(res => {
      this.allVehicles = res.data;
      this.isVehicles = true;
    })
  }

  //get all  batteries list
  getAllBatteriesList() {
    this.batteryService.getAllBatteriesList().subscribe(res => {
      this.allBatteriesList = res.data;
    })
  }

  //get all  tyres list
  getAllTyresList() {
    this.tyreService.getAllTyresList().subscribe(res => {
      this.allTyresList = res.data;
    })
  }

  //get all oils list
  getAllOilsList() {
    this.oilService.getAllOilsList().subscribe(res => {
      this.allOilsList = res.data;
    })
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        console.log('place change')
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.setCurrentLocation();
          this.zoom = 12;
        });
      });
    });

  }

  private setCurrentLocation() {
    // if ('geolocation' in navigator) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.latitude = position.coords.latitude;
    //     this.longitude = position.coords.longitude;
    //     this.zoom = 8;
    //     this.getAddress(this.latitude, this.longitude);
    //   });
    // }
    this.getAddress(this.latitude, this.longitude);
  }

  markerDragEnd($event: any) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  agentData;
  agentName;
  getuserById() {
    let id = this.userInfoService.getAuthData();
    this.userService.getUserById(id).subscribe(res => {
      this.agentData = res.data;
      this.agentName = this.agentData.firstName + ' ' + this.agentData.lastName
    })
  }


  empty;
  checkCustomer() {
    this.userService.getUserByContact(this.inquiry.contactNo).subscribe(res => {
      if (res.success) {
        this.inquiry.customerId = res.data._id;
        this.user.firstName = res.data.firstName;
        this.user.lastName = res.data.lastName;
        this.user.email = res.data.email;
        this.user.address = res.data.address;
        this.user.state = res.data.state;
        if (res.data.vehicles.length > 0) {
          this.customerVehicles = res.data.vehicles;
          this.addCustomerVehicles();
        } else {
          this.customerVehicles = [];
        }
        this.userData = res.data;
        this.isUser = true;
      } else {
        this.isUser = false;
        for (var prop in this.user) {
          if (this.user.hasOwnProperty(prop)) {
            this.user[prop] = '';
          }
        }
        this.user.state = null;
        this.inquiry.customerId = '';
      }
    })
  }




  stateChange(ev) { }



  vehicleBrandChange(ev) {
    this.vehicles = this.allVehicles.filter(data => data.brandId == ev.value._id);
    // this.vehicles = this.resourceService.getAllBrandVehicles(ev.value._id);

    // console.log('all ve' + JSON.stringify(this.vehicles))
  }


  vehicleChange(ev) {
    let vehicle = ev.value;
    this.recomendedBatteries = [];
    this.recomendedOils = [];
    this.recomendedTyres = [];
    this.selectedBattery = '';
    this.selectedTyre = '';
    this.selectedOil = '';
    // for(let i=0 ; i < )
    if (vehicle.batteries.length > 0) {
      for (let i = 0; i < vehicle.batteries.length; i++) {
        let battery = this.allBatteriesList.find(data => data._id == vehicle.batteries[i]);
        if (battery) {
          this.recomendedBatteries.push(battery)
        }
      }
    }


    if (vehicle.oils.length > 0) {
      for (let i = 0; i < vehicle.oils.length; i++) {
        let oil = this.allOilsList.find(data => data._id == vehicle.oils[i]);
        if (oil) {
          this.recomendedOils.push(oil)
        }
      }
    }

    if (vehicle.tyres.length > 0) {
      for (let i = 0; i < vehicle.tyres.length; i++) {
        let tyre = this.allTyresList.find(data => data._id == vehicle.tyres[i]);
        if (tyre) {
          this.recomendedTyres.push(tyre)
        }
      }
    }
  }

  batteryChange(ev) {
    this.selectedBattery = ev.value;
  }

  oilChange(ev) {
    this.selectedOil = ev.value;
  }

  tyreChange(ev) {
    this.selectedTyre = ev.value;
  }






  updateInquiry() {
    this.inquiry.personalInfo = this.user;
    let data = {
      lat: this.latitude,
      long: this.longitude,
      address: this.address,
      isCustom: false,
    }
    this.inquiry.address = data;


    this.inquiryService.updateEnquiry(this.inqData._id, this.inquiry).subscribe(res => {
      this.isDisabled = false;
      if (res.success) {
        // document.getElementById('resetBtn').click();
        this.getEnquiryDetail(this.inqId) // get tech stock detail
        this.alert.actionResponse(res.message, 'success');
        this.data.onRefresh();
      } else {
        this.alert.actionResponse(res.message, 'false');
      }


    })
  }


  addVehicles(): void {
    const dialogRef = this.dialog.open(washVehiclesComponent, {
      data: this.selectedpackage
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const findA = this.customerVehicles.find(data => data.vehicleId == result._id);
        if (findA) {
          console.log('car already available')
        } else {
          let vBrand = this.vBrands.find(data => data._id == result.brandId);
          let brandTitle = '';
          if (vBrand) {
            brandTitle = vBrand.title
          }

          this.customerVehicles.push({
            brand: brandTitle,
            vehicleId: result._id,
            modelTitle: result.title,
            modelYear: '',
            plate: '',
            color: ''
          });
        }
        this.addCustomerVehicles();
      }
    });
  }


  viewPackageDetail(): void {
    const dialogRef = this.dialog.open(packageDetailComponent, {
      // data: this.selectedpackage
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // this.getAllBatteriesList();
      }
    });
  }


  //get vehicle title
  getVehicleTitle(carId) {
    const veh = this.allVehicles.find(data => data._id == carId);
    if (veh) {
      const brand = this.vBrands.find(data => data._id == veh.brandId)
      const data = {
        brand: brand.title,
        model: veh.title,
      }
      return data
    }
  }

  addCustomerVehicles() {
    this.vehicles = [];
    if (this.customerVehicles.length > 0) {
      for (let i = 0; i < this.customerVehicles.length; i++) {
        const findVeh = this.allVehicles.find(data => data._id == this.customerVehicles[i].vehicleId);
        if (findVeh) {
          this.vehicles.push(findVeh);
        }
      }

    }


    // this.vehicle
  }


  deleteVehicle(car) {
    this.customerVehicles = this.customerVehicles.filter(data => data != car);
  }

  //get vehicle section

  brand
  brandVehicles
  getBrandVehicles(brandId: string) {
    this.brandVehicles = this.allVehicles.filter(data => data.brandId == brandId);
  }
  vehicle;
  sVehicle;
  getVehicle(ev) {
    this.sVehicle = ev.value;
  }


  defaultVehicle(id) {
    let vehicle = this.allVehicles.find(data => data._id == id);
    this.selectedVehicle = vehicle;
    this.recomendedBatteries = [];
    this.selectedBattery = '';
    // for(let i=0 ; i < )
    if (vehicle.batteries.length > 0) {
      for (let i = 0; i < vehicle.batteries.length; i++) {
        let battery = this.allBatteriesList.find(data => data._id == vehicle.batteries[i]);
        if (battery) {
          this.recomendedBatteries.push(battery)
        }
      }
    }
  }

  //location

  userAddress: string = ''
  userLatitude: string = ''
  userLongitude: string = ''
  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()
  }

  options = {
    types: [],
    componentRestrictions: { country: 'UA' }
  }

  //   [options] = "{
  //   types: [],
  //   componentRestrictions: { country: 'UA' }
  // } "
}
