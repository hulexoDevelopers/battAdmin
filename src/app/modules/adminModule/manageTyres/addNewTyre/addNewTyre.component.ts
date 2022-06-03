import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { searchConfigService } from './../../../shared/services/search.config';
import { tyreService } from './../../../shared/services/tyre.service';
import { UserInfoService } from './../../../shared/auth/userInfoService';
import { imageService } from './../../../shared/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { addNewCompanyComponent } from './../../../shared/popups/companyModule/addNewCompany/addNewCompany.component';
import { tyreModel } from './../models/tyre';
import { companyService } from './../../../shared/services/company.service';
import { editTyreComponent } from 'src/app/modules/shared/popups/tyreModule/editTyre/editTyre.component';

@Component({
  templateUrl: './addNewTyre.component.html',
  styleUrls: ['./addNewTyre.component.scss'],
})


export class addNewTyreComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('moveTop') public moveTop: ElementRef;
  tyre = new tyreModel();
  isDisabled: boolean = false;

  allCompanies
  allTyres;
  companyConfig;
  company = null;
  isCompany: boolean = false;
  isSubmitted: boolean = false;

  form: FormGroup;
  imagePreview: any;
  image;
  editImage: boolean = false;
  disabled: boolean = false;

  itemPerPage = 25;
  page = 1;

  isLoad: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tyreService: tyreService,
    private companyService: companyService,
    // private batteryCompanyService: batteryCompanyService,
    private searchConfigService: searchConfigService,
    private UserInfoService: UserInfoService,
    private imageService: imageService,
    public dialog: MatDialog,
    private alert: alert,
    public data: Data

  ) {
    this.companyConfig = this.searchConfigService.companyConfig;
  }



  ngOnInit() {
    this.getAllCompaniesList();
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




  //add new company
  addNewcompany(): void {
    const dialogRef = this.dialog.open(addNewCompanyComponent, {
      data: 'tyre'
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCompaniesList(true);

      }
    });
  }



  //get all companies list
  getAllCompaniesList(val: boolean = false) {
    this.companyService.getAllCompanysList().subscribe(res => {
      this.allCompanies = res.data.filter(data => data.type == 'tyre');
      if (val) {
        this.tyre.companyId = res.data[0]._id;
        this.company = res.data[0]
      }
      this.getAllTyresList();
    })
  }


  //get all tyres list
  getAllTyresList() {
    this.tyreService.getAllTyresWithCompanies().subscribe(res => {
      this.allTyres = res.data;
      console.log('all tyre ' + this.allTyres.length)
      // this.allBatteries = res.data.filter(o1 => this.allBrands.some(o2 => o1.companyId === o2._id));
      this.isLoad = true;
    })
  }


  isRequired: boolean = true;
  companyChange(ev) {
    this.isCompany = true;
    this.tyre.companyId = ev.value._id;
  }



  lowerCase() {
    this.tyre.title = this.company.title.toLowerCase().trim();
  }



  saveNewTyre() {
    this.disabled = true;
    if (this.image) {
      //upload image first
      this.uploadImage();
    } else {
      //upload tyre only
      this.addNewTyre();
    }
  }


  addNewTyre() {
    this.tyre.userId = this.UserInfoService.getAuthData();
    this.tyre.tyreId = this.data.generateRandomString(6);
    this.tyre.price = Number(this.tyre.price);
    this.tyre.quantity = Number(this.tyre.quantity)
    let stock = {
      stockId: this.data.getRandomNumber(),
      tyreId: this.tyre.tyreId,
      quantity: this.tyre.quantity,
      assign: 0,
      unAssign: 0,
      totalSale: 0,
      type: 'opening',
      createdDate: new Date(),
      isDeleted: false,
      updatedDate: ''
    }
    this.disabled = true;
    this.tyre.stock = [];
    this.tyre.stock.push(stock);

    this.tyreService.addNewTyre(this.tyre).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
        this.disabled = false;
        return;
      } else {
        this.getAllTyresList();
        this.alert.responseAlert(res.message, 'success');
        this.tyre.imageUrl = ''
        this.myInputVariable.nativeElement.value = ''
        this.image = '';
        this.imagePreview = '';
        document.getElementById('cancelBtn').click();
        this.myInputVariable.nativeElement.value = ''
        this.disabled = false;

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
      this.tyre.imageUrl = res.url;
      this.addNewTyre(); //now saving tyre data;
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



  //edit tyre
  editTyre(tyreId: string): void {
    const dialogRef = this.dialog.open(editTyreComponent, {
      data: tyreId
    }).updatePosition({});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllTyresList();
      }
    });
  }




  //delete tyre
  deleteTyre(tyreId: string) {
    this.confirmationDelete(tyreId);
  }

  //confirm delete tyre
  confirmDelete(tyreId: string) {
    this.tyreService.deleteTyre(tyreId).subscribe(res => {
      if (!res.success) {
        this.alert.responseAlert(res.message, 'error');
      } else {
        this.alert.responseAlert(res.message, 'success');
        this.getAllTyresList();

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
