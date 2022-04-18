import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { UserInfoService } from '../auth/userInfoService';
import { MatDialog } from '@angular/material/dialog';
import { addNewBatteryCompanyComponent } from '../popups/batteryModule/addNewBatteryCompany/addNewBatteryCompany.component';

@Injectable({ providedIn: 'root' })
export class shareModalService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        public dialog: MatDialog,
        private userService: UserInfoService
    ) { }



    //add new company
    addNewcompany(): void {
        const dialogRef = this.dialog.open(addNewBatteryCompanyComponent, {
        }).updatePosition({});

        dialogRef.afterClosed()
        // .subscribe(result => {
        //     if (result) {
        //         return true
        //         // this.getAllBatteryCompanies();
        //     } else {
        //         return false;
        //     }
        // });
    }

    // //edit battery
    // editBattery(batteryId: string): void {
    //     const dialogRef = this.dialog.open(editBatteryComponent, {
    //         data: batteryId
    //     }).updatePosition({});

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             this.getAllBatteriesList();
    //         }
    //     });
    // }


}

