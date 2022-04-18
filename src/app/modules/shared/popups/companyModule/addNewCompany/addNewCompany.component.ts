import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { companyService } from '../../../services/company.service';
import { imageService } from '../../../services/image.service';
import { Data } from '../../../services/shareDataService';
import { Company } from '../../../models/company';



@Component({
  selector: 'app-newCompany',
  templateUrl: './addNewCompany.component.html',
  styleUrls: ['./addNewCompany.component.scss']
})
export class addNewCompanyComponent implements OnInit {

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  company = new Company();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;

  disabled: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<addNewCompanyComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private companyService: companyService,
    private alert: alert,
    private Data: Data
    // private userService: userService
  ) { }



  ngOnInit() {
    this.company.type = this.data;
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


  saveNewCompany() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload data only
      this.saveCompanyData()
    }
  }


  //save company data 
  saveCompanyData() {
    this.company.userId = this.userInfoService.getAuthData();
    this.company.title = this.company.title.trim().toLowerCase();
    this.company.companyId = this.Data.generateRandomString(6)
    if (!this.company.title) {
      return;
    }
    this.companyService.addNewCompany(this.company).subscribe(res => {
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



  }

  uploadImage() {
    this.image = this.form.value.image
    this.imageService.upLoadImage(this.image).subscribe(res => {
      this.company.imageUrl = res.url;
      this.saveCompanyData(); //save company data;
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
