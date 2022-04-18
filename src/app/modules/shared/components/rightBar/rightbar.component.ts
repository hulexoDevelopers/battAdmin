import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-rightSidebar',
  templateUrl: './rightbar.component.html',
  styleUrls: ['./rightbar.component.scss']
})
export class rightSidebarComponent implements OnInit {



  constructor(
    private router: Router,
    ) { }

  ngOnInit() {


  }



}
