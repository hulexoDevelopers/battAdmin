import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from '../..//..//shared/services/shareDataService';
import { MatDialog } from '@angular/material/dialog';
import { technicianService } from '../../../shared/services/technician.service';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { imageService } from '../../../shared/services/image.service';
import Swal from 'sweetalert2';
import { userService } from '../../../shared/services/user.service';
import { editUserProfileComponent } from 'src/app/modules/shared/popups/editUser/editUser.component';
import { jobService } from './../../../shared/services/job.service';




@Component({
  templateUrl: './technicianSorting.component.html',
  styleUrls: ['./technicianSorting.component.scss'],
})
export class technicianSortingComponent implements OnInit {

  allTechnicians;


  itemPerPage = 25;
  page = 1;
  isLoad: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technicianService: technicianService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    private imageService: imageService,
    private jobService: jobService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {
    this.getAllTechniciansSorting();
  }



  //get all technicans list
  getAllTechniciansSorting() {
    this.jobService.getBusiestTechSorting().subscribe(res => {
      let data = res.data.sort((a, b) => a.totalJobs - b.totalJobs);
      this.allTechnicians = data.reverse();
    
      this.isLoad = true;
    })
  }


}
