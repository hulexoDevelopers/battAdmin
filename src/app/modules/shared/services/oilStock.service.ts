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
export class oilStockService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new oil stock
    addNewOilStock(data) {
        return this._api.post(`${"oilStock/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get stock by user assign
    getStockByUserAssign(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('oilId', data.oilId);
        httpParams = httpParams.append('stockId', data.stockId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"oilStock/byTechAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech stock detail
    getTechStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('oilId', data.oilId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"oilStock/techTotalAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get oil stock detail
    getOilStockDetails(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('oilId', data.oilId);
        return this._api.get(`${"oilStock/byOilIdTech?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    getOilTechnicianWithJobs(id) {
        return this._api.get(`${"oilStock/byTechnicianAndJobsDetail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    getOilAvaialbeAssignStock(id: string) {
        return this._api.get(`${"oilStock/getOilAvaialbeAssignStock/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech oil stock detail
    getTechOilStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('oilId', data.oilId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"oilStock/byTechOilDetaiL?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update oil stock by id
    updateOilStock(id: string, data: any) {
        return this._api.put(`${"oilStock/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }




}

