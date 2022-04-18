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
export class inquiryService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new enquiry
    addNewEnquiry(data) {
        return this._api.post(`${"inquiry/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all enquirires
    getAllEnquiries() {
        return this._api.get(`${"inquiry/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get enquiry by user id
    getEnquiryByUserId(userId: string) {
        return this._api.get(`${"inquiry/byUserId/" + userId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    // //get all enquiries by date
    // getEnquiriesByDate(data) {
    //     let httpParams = new HttpParams();
    //     httpParams = httpParams.append('startDate', data.startDate);
    //     httpParams = httpParams.append('endDate', data.endDate);
    //     return this._api.get(`${"inquiry/all/byDate?" + httpParams}`)
    //         .pipe(
    //             map((res: any) => res),
    //             catchError((error: any) => Observable.throw(error))
    //         );
    // }

    //get enquiry by enquiry id
    getEnquiryById(id: string) {
        return this._api.get(`${"inquiry/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update enquiry
    updateEnquiry(id: string, data: any) {
        return this._api.put(`${"inquiry/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //delete enquiry
    deleteEnquiry(id: string) {
        return this._api.put(`${"inquiry/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get enquirires by date
    getEnquiriesByDate(date) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('date', date)
        return this._api.get(`${"inquiry/byDate?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


}

