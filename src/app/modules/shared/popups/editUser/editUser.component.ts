import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../auth/userInfoService';
import { alert } from '../../services/sweetAlert.service';
import { imageService } from './../../services/image.service';
import { searchConfigService } from './../../../shared/services/search.config';
import { userModel } from './../../models/user'
import { Data } from './../../services/shareDataService';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editUser',
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.scss']
})
export class editUserProfileComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  user = new userModel();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  userId: string;
  isLoad: boolean = false;

  allStates;
  state = null;

  allowDispatch;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editUserProfileComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private searchConfigService: searchConfigService,
    private alert: alert,
    private Data: Data
    // private userService: userService
  ) {
    this.allStates = this.Data.getAllStates();
    this.userId = data;
    if (this.userId) {
      this.getUserById();
    } else {
      this.onClose();
    }

  }

  agentLocation = null;
  //get user data with id
  getUserById() {
    this.userService.getUserById(this.userId).subscribe(res => {
      this.user = res.data;
      this.state = this.user.state;
      if (res.data.role == 'agent') {
        this.allowDispatch = res.data.data[0].allowDispatch;
        this.agentLocation = res.data.data[0].agentLocation
        // this.agentLocation = res.data.location
      }

      this.isLoad = true;
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.user.imageUrl = res.data.imageUrl;
        this.imagePreview = res.data.imageUrl;
      }
    })
  }




  stateChange(ev) {
    // console.log('ev ' + ev.target.value);
    this.user.state = ev.target.value;
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
  }


  updateUser() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload user only
      this.updateUserData()
    }
  }


  //update user data 
  updateUserData() {
    this.user.userId = this.userInfoService.getAuthData();
    this.user.firstName = this.user.firstName.trim().toLowerCase();
    this.user.lastName = this.user.lastName.trim().toLowerCase();

    if (this.user.role == 'agent') {
      this.user.data[0].allowDispatch = this.allowDispatch
    }
    if (!this.user.firstName || !this.user.lastName) {
      return;
    }
    this.userService.updateUser(this.userId, this.user).subscribe(res => {
      if (res.success) {
        this.dialogRef.close(true);
        this.alert.responseAlert(res.message, "success");

      } else {
        this.alert.responseAlert(res.message, "error")
      }
    })
  }

  //close popup
  onClose() {
    this.dialogRef.close(false);
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

    // if (this.image.size > 200000) {
    //   this.alert.responseAlert("Image is too large", 'error');
    //   this.image = ''
    //   this.imagePreview = ''
    //   this.myInputVariable.nativeElement.value = "";
    //   return;
    // }
    this.validImage();
    this.ValidImageSize();

    this.editImage = true;



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      this.user.imageUrl = res.url;
      this.updateUserData(); //now saving user data;
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

}
