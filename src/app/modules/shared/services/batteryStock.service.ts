import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { UserInfoService } from '../auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class batteryStockService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new battery stock
    addNewBatteryStock(data) {
        return this._api.post(`${"batteryStock/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    // //get all battery companies
    // getAllBatteryCompanysList() {
    //     return this._api.get(`${"batteryCompany/all"}`)
    //         .pipe(
    //             map((res: any) => res),
    //             catchError((error: any) => Observable.throw(error))
    //         );
    // }

    //get stock by user assign
    getStockByUserAssign(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('batteryId', data.batteryId);
        httpParams = httpParams.append('stockId', data.stockId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"batteryStock/byTechAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech stock detail
    getTechStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('batteryId', data.batteryId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"batteryStock/techTotalAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get battery stock detail
    getBatteryStockDetails(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('batteryId', data.batteryId);
        // httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"batteryStock/byBatteryIdTech?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    getBatteryTechnicianWithJobs(id) {
        // let httpParams = new HttpParams();
        // httpParams = httpParams.append('batteryId', data.batteryId);
        // httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"batteryStock/byTechnicianAndJobsDetail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    getBatteryAvaialbeAssignStock(id: string) {
        return this._api.get(`${"batteryStock/getBatteryAvaialbeAssignStock/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech battery stock detail
    getTechBatteryStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('batteryId', data.batteryId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"batteryStock/byTechBatteryDetaiL?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update battery stock by id
    updateBatteryStock(id: string, data: any) {
        return this._api.put(`${"batteryStock/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    // //delete battery company
    // deleteBatteryCompany(id: string) {
    //     return this._api.put(`${"batteryCompany/delete/" + id}`)
    //         .pipe(
    //             map((res: any) => res),
    //             catchError((error: any) => Observable.throw(error))
    //         );
    // }




}

