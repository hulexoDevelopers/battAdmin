import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { technicianModel } from '../models/technician';
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
  templateUrl: './addNewTechnician.component.html',
  styleUrls: ['./addNewTechnician.component.scss'],
})
export class addNewTechnicianComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  technician = new technicianModel();
  isDisabled: boolean = false;


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  allTechnicians;


  itemPerPage = 5;
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
    this.allStates = this.data.getAllStates();
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
    this.getAllTechnicianList();
  }



  //get all technicans list
  getAllTechnicianList() {
    this.userService.getAllUsers().subscribe(res => {
      this.allTechnicians = res.data.filter(data => data.role == 'technician');
    })
  }




  stateChange(ev) {
    // console.log('ev ' + ev.target.value);
    this.technician.state = ev.target.value;
  }


  saveNewTechnician() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload technician only
      this.addNewTechnician();
    }
  }



  addNewTechnician() {
    this.technician.userId = this.UserInfoService.getAuthData();
    this.technician.role = 'technician';
    this.technician.password = this.technician.contact;
    // this.vehicle.batteries = this.selectedBatteries
    this.disabled = true;
    // console.log('add new vehicle' + JSON.stringify(this.vehicle));

    this.userService.addNewUser(this.technician).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      if (!res.success) {
        this.alert.actionResponse(res.message, 'error');
        // this.data.onRefresh();
        this.disabled = false;
        return;
      } else {
        this.getAllTechnicianList(); //get all technician list
        this.alert.actionResponse(res.message, 'success');
        this.technician.imageUrl = ''
        this.myInputVariable.nativeElement.value = ''
        this.image = '';
        this.imagePreview = '';
        document.getElementById('cancelBtn').click();
        this.myInputVariable.nativeElement.value = ''
        this.disabled = false;
        // this.companyUser = res.data
        // this.saveCompanyProfile();
      }
    })

  }





  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    this.image = this.form.value.image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    this.image = this.form.value.image
    this.validImage();
    this.ValidImageSize();



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      this.technician.imageUrl = res.url;
      this.addNewTechnician(); //now saving new vehicle;
    })

  }

  validFile
  invalidType
  inValidImage
  validImage() {

    if (this.image.type === 'image/jpeg' ||
      this.image.type === 'image/png' ||
      this.image.type === 'image/jpg' ||
      this.image.type === 'image/svg') {
    } else {
      this.alert.responseAlert("Image is not valid", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
    }

  }


  ValidImageSize() {
    if (this.image.size > 200000) {
      this.alert.responseAlert("Image is too large", 'error');
      this.image = ''
      this.imagePreview = ''
      this.myInputVariable.nativeElement.value = "";
      return;
    }
  }




  //edit profile
  editProfile(userId: string): void {
    const dialogRef = this.dialog.open(editUserProfileComponent, {
      data: userId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTechnicianList();
      }
    });
  }





  //delete profile
  deleteTechnician(userId: string) {
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
        this.getAllTechnicianList();

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
