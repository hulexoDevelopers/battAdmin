import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';





@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class homeComponent implements OnInit {


  allLocations;
  message;
  messageClass;
  otherLocation;
  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {


  }



  

  ngOnInit() {
    // this.loadScript("assets/js/main.js");
    
 
  }


  
  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }






}
