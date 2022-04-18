import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Data } from '../../shared/services/shareDataService';
import { userModel } from '../models/user';
import { userService } from '../services/userService';
// import { alert } from '../../shared/services/sweetAlert.service';
import { UserInfoService } from '../../shared/auth/userInfoService';
import { alert } from './../../shared/services/sweetAlert.service';
import { SocService } from './../../shared/services/soc.service';
declare var $: any;


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class loginComponent implements OnInit {

  user = new userModel();
  message;
  messageClass;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: Data,
    private userService: userService,
    private userInfoService: UserInfoService,
    private SocService: SocService,
    public alert: alert
  ) {
  }



  ngOnInit() {
    // this.loadScript("assets/js/main.js")
    // this.checkLogin(); // check if user is already login

  }



  //load generated fields
  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  //check login
  checkLogin() {

    let role = this.userInfoService.getUserRole();
    if (role === 'supAdmin') {
      this.router.navigate(['/dashboard']);
    }
    if (role === 'company') {
      this.router.navigate(['/company/dashboard'])
    }
  }


  onLogin() {
    this.userService.loginUser(this.user).subscribe(res => {

      if (!res.success) {
        this.alert.responseAlert(res.message, 'error')
      } else {
        localStorage.setItem("_auth", res.token);

        let role = this.userInfoService.getUserRole();
        let data = {
          userId: this.userInfoService.getAuthData(),
          role: role
        }
        this.SocService.emit('addUser', data);
        // this.SocService.on('getUsers').subscribe(data => {
        //   console.log('data'  + JSON.stringify(data))
        // })

        // return
        if (role === 'supAdmin') {
          this.router.navigate(['/dashboard']);
        }
        if (role === 'agent') {
          this.router.navigate(['/support']);
        }
        if (role === 'customer') {
          this.alert.responseAlert('Invalid user', 'error')
          localStorage.removeItem("_auth");
        }
      }
    })
  }


  emailChange() {
    this.user.email = this.user.email.trim().toLowerCase();
  }


}
