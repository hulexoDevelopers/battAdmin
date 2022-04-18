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



@Component({
  templateUrl: './allCustomersList.component.html',
  styleUrls: ['./allCustomersList.component.scss'],
})
export class allCustomersListComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  isDisabled: boolean = false;


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  allCustomers;


  itemPerPage = 100;
  page = 1;

  allStates;
  state = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technicianService: technicianService,
    private UserInfoService: UserInfoService,
    private userService: userService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {

  }



  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      })
    });
    // this.getAllBrandsList();
    // this.getAllBatteriesList();
    this.getAllCustomersList();
  }



  //get all customers list
  getAllCustomersList() {
    this.userService.getAllUsers().subscribe(res => {
      this.allCustomers = res.data.filter(data => data.role == 'customer');
    })
  }




  //edit profile
  editProfile(userId: string): void {
    const dialogRef = this.dialog.open(editUserProfileComponent, {
      data: userId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCustomersList();
      }
    });
  }





  //delete profile
  deleteCustomer(userId: string) {
    this.confirmationDelete(userId);
  }

  //confirm delete technician
  confirmDelete(userId: string) {
    this.userService.deleteUser(userId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        // this.data.onRefresh();
        this.getAllCustomersList();

      }
    })
  }



  confirmationDelete(catId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.confirmDelete(catId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your  file is safe :)',
        //   'error'
        // )
      }
    })
  }


}
