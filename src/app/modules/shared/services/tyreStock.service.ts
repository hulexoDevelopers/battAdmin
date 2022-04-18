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
export class tyreStockService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new tyre stock
    addNewTyreStock(data) {
        return this._api.post(`${"tyreStock/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get stock by user assign
    getStockByUserAssign(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('stockId', data.stockId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/byTechAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech stock detail
    getTechStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/techTotalAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tyre stock detail
    getTyreStockDetails(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        return this._api.get(`${"tyreStock/byTyreIdTech?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    getTyreTechnicianWithJobs(id) {
        return this._api.get(`${"tyreStock/byTechnicianAndJobsDetail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    getTyreAvaialbeAssignStock(id: string) {
        return this._api.get(`${"tyreStock/getTyreAvaialbeAssignStock/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech tyre stock detail
    getTechTyreStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/byTechTyreDetaiL?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update tyre stock by id
    updateTyreStock(id: string, data: any) {
        return this._api.put(`${"tyreStock/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }




}

