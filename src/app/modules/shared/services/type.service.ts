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
export class typeService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new meal plan type
    addNewMealPlanType(data) {
        return this._api.post(`${"type/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all meal types
    getAllMealTypes() {
        return this._api.get(`${"type/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get all meal types
    getAllMealTypesAllTime() {
        return this._api.get(`${"type/allTime"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get type by type id
    getTypeById(id: string) {
        return this._api.get(`${"type/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update type
    updateType(id: string, data: any) {
        return this._api.put(`${"type/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //delete type
    deleteType(id: string) {
        return this._api.put(`${"type/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }




}

