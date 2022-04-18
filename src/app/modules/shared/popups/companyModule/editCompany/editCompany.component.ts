import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Company } from '../../../models/company';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userService } from 'src/app/modules/userModule/services/userService';
import { UserInfoService } from '../../../auth/userInfoService';
import { alert } from '../../../services/sweetAlert.service';
import { imageService } from './../../../services/image.service';
import { companyService } from './../../../services/company.service';

@Component({
  selector: 'app-editCompany',
  templateUrl: './editCompany.component.html',
  styleUrls: ['./editCompany.component.scss']
})
export class editCompanyComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  company = new Company();


  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  companyId: string;
  isLoad: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<editCompanyComponent>,
    private imageService: imageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: userService,
    private userInfoService: UserInfoService,
    private companyService: companyService,
    private alert: alert,
    // private userService: userService
  ) {
    this.companyId = data;
    if (this.companyId) {
      this.getCompanyById();
    } else {
      this.onClose();
    }

  }


  //get compnay by id
  getCompanyById() {
    this.companyService.getCompanyById(this.companyId).subscribe(res => {
      this.company.title = res.data.title;
      this.company.companyId = res.data.companyId
      if (res.data.imageUrl == '') {
        this.image = ''
      } else {
        this.image = res.data.imageUrl;
        this.company.imageUrl = res.data.imageUrl;
        this.imagePreview = res.data.imageUrl;

      }
      this.isLoad = true;
    })
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


  updateCompany() {
    if (this.image && this.editImage) {
      //upload image first
      this.uploadImage();
    } else {
      //upload company only
      this.updateCompanyData()
    }
  }


  //update company data 
  updateCompanyData() {
    this.company.userId = this.userInfoService.getAuthData();
    this.company.title = this.company.title.trim().toLowerCase();
    if (!this.company.title) {
      return;
    }

    this.companyService.updateCompany(this.companyId, this.company).subscribe(res => {
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
      this.company.imageUrl = res.url;
      this.updateCompanyData(); //now saving company data;
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
