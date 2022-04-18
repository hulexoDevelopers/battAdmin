// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { washVehiclesComponent } from './../../../shared/popups/getWashVehicles/getWashVehicles.component';
import { packageDetailComponent } from './../../../shared/popups/packageDetail/packageDetail.component';
import { vehicleService } from './../../manageVehicles/services/vehicleService';
import { batteryService } from './../../../shared/services/battery.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { mapApiService, Maps } from './../../../shared/services/mapApi.service';
// import { geolib } from './../../../shared/services/geolib';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
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
  templateUrl: './addNewInquiry.component.html',
  styleUrls: ['./addNewInquiry.component.scss'],
})
export class addNewInquiryComponent implements OnInit {
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
  offerServices = ['Battery Change', 'Car Wash', 'Oil Change', 'Tire Change'];
  inqStatus = ['Closed', 'Open', 'Non Business Call', 'Rejected']
  vBrands;
  allVehicles;
  vehicles;
  allBatteriesList;
  // bBrands;
  // batteries;
  recomendedBatteries = [];
  // vehicleDetail = {} as Vehicle;
  // batteryDetail = {} as Battery;
  selectedBrand;
  selectedVehicle;
  selectedBattery;
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
    private alert: alert,
    public data: Data,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone

  ) {
    this.getuserById();
    this.getAllBrandsList();
    this.getAllBatteriesList();
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

  //get all vehicle brands list
  getAllBrandsList() {
    this.brandService.getAllBrandsList().subscribe(res => {
      this.vBrands = res.data;
      this.getAllVehicleList();
    })
  }

  //get all vehicle list
  getAllVehicleList() {
    this.vehicleService.getAllVehicleList().subscribe(res => {
      this.allVehicles = res.data;
    })
  }

  //get all  batteries list
  getAllBatteriesList() {
    this.batteryService.getAllBatteriesList().subscribe(res => {
      this.allBatteriesList = res.data;
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

          console.log('at ' + this.latitude)
          console.log('long ' + this.longitude)
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

  saveNewInquiry() {
    this.isDisabled = true;
    if (this.isUser) {
      this.updateCustomer();
    } else {
      this.registerNewCustomer();
    }
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

  batteryChange(ev) {
    this.selectedBattery = ev.value;
  }


  registerNewCustomer() {
    this.customer.firstName = this.user.firstName;
    this.customer.lastName = this.user.lastName;
    this.customer.email = this.user.email;
    this.customer.password = this.inquiry.contactNo;
    this.customer.userId = this.userInfoService.getAuthData();
    this.customer.address = this.user.address;
    this.customer.state = '';
    this.customer.contact = this.inquiry.contactNo;
    if (this.customerVehicles.length > 0) {
      this.customer.vehicles = this.customerVehicles
    }
    // this.customer.vehicles.push()
    this.userService.addNewUser(this.customer).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      if (res.success) {
        this.inquiry.customerId = res.data._id
        this.saveInquiry()
      } else {
        this.alert.actionResponse(res.message, 'Something wrong please try again');
      }
    })
  }

  updateCustomer() {
    this.userData.vehicles = this.customerVehicles;
    this.userService.updateUser(this.userData._id, this.userData).subscribe(res => {
      if (res.success) {
        this.inquiry.customerId = this.userData._id
        this.saveInquiry()
      } else {
        this.alert.actionResponse(res.message, 'Something wrong please try again');
      }
    })
  }


  saveInquiry() {
    this.inquiry.userId = this.userInfoService.getAuthData();
    this.inquiry.personalInfo = this.user;
    // let address = {
    //   long: '',
    //   lat: '',
    //   address: this.user.address,
    //   state: this.user.state
    // }
    let data = {
      lat: this.latitude,
      long: this.longitude,
      address: this.address,
      isCustom: false,
    }
    this.inquiry.address = data;

    // this.inquiry.address = this.address;
    if (this.inquiry.serviceType == 'Battery Change') {
      let serviceDetail = {
        serviceType: this.inquiry.serviceType,
        isBattery: false,
        battery: '',
        priceQuoted: this.priceQuoted
      }
      if (this.selectedBattery) {
        serviceDetail.isBattery = true;
        serviceDetail.battery = this.selectedBattery._id
      }
      this.inquiry.serviceDetail = serviceDetail;
      this.inquiry.vehicleDetail = [];
      this.inquiry.vehicleDetail.push(this.selectedVehicle._id);
    }

    if (this.inquiry.serviceType == 'Car Wash') {
      let serviceDetail = {
        serviceType: this.inquiry.serviceType,
        ispackage: false,
        package: ''
      }
      if (this.selectedpackage) {
        serviceDetail.ispackage = true;
        serviceDetail.package = this.selectedpackage
      }
      this.inquiry.serviceDetail = serviceDetail;
    }

    if (this.inquiry.serviceType == 'Oil Change' || this.inquiry.serviceType == 'Tire Change') {
      let serviceDetail = {
        serviceType: this.inquiry.serviceType,
        appointmentDate: this.appointmentDate,

      }

      this.inquiry.serviceDetail = serviceDetail;
    }



    this.inquiryService.addNewEnquiry(this.inquiry).subscribe(res => {
      this.isDisabled = false;
      if (res.success) {
        document.getElementById('resetBtn').click();
        this.inquiry.inquiryStatus = 'Open';
        this.customerVehicles = []
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
