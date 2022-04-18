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
import { batteryStockService } from './../../../shared/services/batteryStock.service';
import { resourceService } from './../../../shared/services/reource.service';
import { editTechnicianStockComponent } from './../../../shared/popups/editTechnicianStock/editTechnicianStock.component';



@Component({
  templateUrl: './technicianDetail.component.html',
  styleUrls: ['./technicianDetail.component.scss'],
})
export class technicianDetailComponent implements OnInit {

  techId: string;
  technician;
  techStock;

  itemPerPage = 5;
  page = 1;;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technicianService: technicianService,
    private UserInfoService: UserInfoService,
    private batteryStockService: batteryStockService,
    private userService: userService,
    private imageService: imageService,
    public resourceService: resourceService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {

    // this.getAllBrandsList();
    // this.getAllBatteriesList();
    // this.getAllTechnicianList();
    this.getParamsId();

  }


  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.techId = params.id;
        if (!this.techId) {
          this.data.goBack();
          return;
        } else {
          this.getTechnicianDetail(this.techId) //get tech detail
          this.getTechStockDetail(this.techId) // get tech stock detail
        }
      }
    });
  }

  //get technician detail
  getTechnicianDetail(id: string) {
    this.userService.getUserById(id).subscribe(res => {
      this.technician = res.data;
    })
  }

  //get tech stock detail
  getTechStockDetail(techId: string) {
    let data = {
      techId: techId
    }
    this.batteryStockService.getTechStockDetail(data).subscribe(res => {
      this.techStock = res.data;
      console.log('res' + JSON.stringify(res))
    })
  }





  //edit Technician Stock
  editTechnicianStock(batteryId: string): void {
    let data1 = {
      techId: this.techId,
      batteryId: batteryId
    }
    const dialogRef = this.dialog.open(editTechnicianStockComponent, {
      data: data1,
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamsId();
      }
    });
  }




}
