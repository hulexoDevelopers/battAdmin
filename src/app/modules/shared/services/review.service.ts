import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { UserInfoService } from '../../shared/auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class reviewService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new review
    addNewReview(data) {
        return this._api.post(`${"review/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all reviews
    getAllReviews() {
        return this._api.get(`${"review/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get customer company orders
    getCustomerCompanyOrder(customerId: string, companyId: string) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('customerId', customerId);
        httpParams = httpParams.append('companyId', companyId);
        return this._api.get(`${"review/customerCompanyOrders?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all company reviews
    getAllCompanyReviews(id: string) {
        return this._api.get(`${"review/byCompanyId/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get company review stats
    getCompanyReviewStats(id: string) {
        return this._api.get(`${"review/companyStats/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get company average
    getCompanyAverage() {
        return this._api.get(`${"review/companyAverage"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //delete review
    deleteReview(id: string) {
        return this._api.put(`${"review/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }




}

