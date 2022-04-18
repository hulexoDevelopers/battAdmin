import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare var $:any;
declare var jQuery:any;
@Component({
  selector: 'app-topBar',
  templateUrl: './TopBar.component.html',
  styleUrls: ['./TopBar.component.scss']
})
export class topBarComponent implements OnInit {

  email;

  constructor(
    private router: Router,


    )
     { }

  ngOnInit() {

  }


}
