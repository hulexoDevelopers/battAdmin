import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfoService } from './../../auth/userInfoService';
import { userService } from './../../../userModule/services/userService';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  login: boolean = false;
  role;
  status: boolean = true;
  isConnected = true;

  constructor(
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService,
  ) {

    this.role = this.userInfoService.getUserRole();
      this.getLoginUser();
  }

  ngOnInit() {


  }



  user
  getLoginUser() {
    let id = this.userInfoService.getAuthData();
    this.userService.getUserById(id).subscribe(res => {
      if (res.success) {
        this.user = res.data
      }
    })
  }



  newOrder() {
    window.open("http://localhost:4800", "_blank");
  }

  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }


  logout() {
    localStorage.removeItem("_auth")
    this.router.navigate(['/user/login'])
  }


}
