import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import Swal from 'sweetalert2';
import { notificationService } from './../../../shared/services/notification.service';
import { userService } from './../../../userModule/services/userService';
import { userModel } from '../modes/user';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class adminProfileComponent implements OnInit {
  user = new userModel()
  notifications;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: notificationService,
    private userService:userService,
    private userInfoService: UserInfoService,
    private alert: alert,
    private data: Data

  ) {


  }


  ngOnInit() {
    this.getUserById(); //get user by id
  }

  userData;
 //get user by id
 getUserById() {
  let id = this.userInfoService.getAuthData();
  this.userService.getUserById(id).subscribe(res => {
    if (res.success && res.data.email) {
      this.userData = res.data;
      this.user = res.data;
    }
  })
}


lowerCase(){
  this.user.email = this.user.email.trim().toLowerCase();
}

updateProfile() {
  let id = this.userInfoService.getAuthData();
  this.userService.updateUser(id, this.user).subscribe(res => {
    if (!res.success) {
      this.alert.responseAlert(res.message, 'error');
    } else {
      this.alert.responseAlert(res.message, 'success');
    }
    this.data.onRefresh();
  })
}


oldPassword;
newPassword;
updateUserPassword() {
  let data = {
    id: this.userInfoService.getAuthData(),
    password: this.oldPassword,
    newPassword: this.newPassword
  }
  this.userService.changePassword(data).subscribe(res => {
    if (!res.success) {
      this.alert.responseAlert(res.message, 'error');
    } else {
      this.alert.responseAlert(res.message, 'success');
    }
    this.data.onRefresh();
  })
}

  
}
