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
export class companyService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new  company
    addNewCompany(data) {
        return this._api.post(`${"company/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all  companies
    getAllCompanysList() {
        return this._api.get(`${"company/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get company by id
    getCompanyById(id: string) {
        return this._api.get(`${"company/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update  company by id
    updateCompany(id: string, data: any) {
        return this._api.put(`${"company/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //delete  company
    deleteCompany(id: string) {
        return this._api.put(`${"company/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }




}

