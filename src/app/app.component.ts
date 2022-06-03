import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserInfoService } from './modules/shared/auth/userInfoService';
import { SocService } from './modules/shared/services/soc.service';
import { alert } from './modules/shared/services/sweetAlert.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Battmobile Dashboard';

  isMain: boolean = false;
  routeload: boolean = false;

  constructor(
    private router: Router,
    private UserInfoService: UserInfoService,
    private alert: alert,
    private SocService: SocService

  ) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: any) => {
        if (event.url == '/user/login') {
          this.isMain = true;
          this.routeload = true;
        } else {
          this.isMain = false;
          this.routeload = true;
        }
      });
    this.loadScript("assets/js/main.js")
  }


  ngOnInit() {

    // this.loadScript("assets/bundles/vendorscripts.bundle.js");
    let data = {
      userId: this.UserInfoService.getAuthData(),
      role: this.UserInfoService.getUserRole()
    }
    this.SocService.emit('addUser', data);
    this.SocService.on('getUsers').subscribe(res =>{
        console.log('users =>' + JSON.stringify(res))
    })


    this.SocService.on('updateActiveJobs').subscribe(res => {
      // this.getAllInquiryList();

    })

    this.SocService.on('refreshJobs').subscribe(res => {
      // this.getAllInquiryList();
    })

    this.SocService.on('newInquiryNotification').subscribe(res => {
      this.alert.actionNotification(`${res.userName} generate ${res.inquiryType} inquiry`, 'info');
      // this.getAllInquiryList();
    })
    this.SocService.on('rejectJobNotification').subscribe(res => {
      this.alert.actionNotification(`Technician reject job no ${res.inquiryId} inquiry`, 'info');
  
    })
  }





  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
