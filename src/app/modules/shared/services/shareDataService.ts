import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from '../auth/userInfoService';
import { Location } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class Data {
  //convert date enums


  public storage: any;
  otherServices;

  allStates = ['']

  public constructor(
    public router: Router,
    private userInfoService: UserInfoService,
    private location: Location,
  ) { }



  //referesh page
  onRefresh() {
    setTimeout(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
      let currentUrl = this.router.url + '?';
      this.router.navigateByUrl(currentUrl)
        .then(() => {
          this.router.navigated = false;
          this.router.navigate([this.router.url]);
        });
    }, 3000);
    // location.reload()

  }

  //referesh page
  onReset() {

    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
    let currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });

    // location.reload()

  }

  //get random number for bill
  getRandomNumber() {
    let billNo = 0;
    let num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return num

  }



  goBack() {
    this.location.back();
  }





  getAllMonths() {
    let months = [
      {
        name: 'January',
        value: 0
      },
      {
        name: 'February',
        value: 1
      },
      {
        name: 'March',
        value: 2
      },
      {
        name: 'April',
        value: 3
      },
      {
        name: 'May',
        value: 4
      },
      {
        name: 'June',
        value: 5
      },
      {
        name: 'July',
        value: 6
      },
      {
        name: 'August',
        value: 7
      },
      {
        name: 'September',
        value: 8
      },
      {
        name: 'October',
        value: 9
      },
      {
        name: 'November',
        value: 10
      },
      {
        name: 'December',
        value: 11
      },


    ]
    return months;
  }


  //all states
  getAllStates() {
    let states = ['Abu Dhabi','Ajman', 'Dubai', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'];
    return states;
  }

   getLocations(){
    let locations = [
      {title:'Abu Dhabi'},{title:'Ajman'},{title:'Dubai'},{title:'Ras Al Khaimah'},{title:'Sharjah'},{title:'Umm Al Quwain'}
    ]
    return locations
  }


  dateFromDay(day, year) {
    var date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }

  getPlanDays(days, startDate) {
    const schedule = []
    let uID = this.generateRandomString(6);
    for (let i = 0; i < Number(days); i++) {
      let d = new Date(startDate);
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      var end = new Date(d)
      end.setHours(23, 59, 59);
      let sDate = this.withoutTime(new Date(d)) //cinvert dates
      let data = {
        id: uID,
        title: '',
        start: new Date(sDate),
        end: new Date(end),
        status: 'active'
      }
      schedule.push(data)
    }

    return schedule;
    // this.Globals.mealSchedule = this.mealPlan
  }


  generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  year;
  month;
  date;
  withoutTime(eventDate) {
    let date = new Date(eventDate);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    if (this.date < 10) {
      this.date = '0' + this.date;
    }
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    let datee = this.year + '-' + this.month + '-' + this.date
    return datee
  }


  isInArray(array, value) {
    
    let data = array.find(data => this.withoutTime(data.start) == this.withoutTime(value));
    if (data) {
      return true
    } else {
      return false
    }
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

}
