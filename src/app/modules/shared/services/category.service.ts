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
export class categoryService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new meal plan category
    addNewMealPlanCategory(data) {
        return this._api.post(`${"category/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all meal categories
    getAllMealCategories() {
        return this._api.get(`${"category/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get category by category id
    getCategoryById(id: string) {
        return this._api.get(`${"category/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update category
    updateCategory(id: string, data: any) {
        return this._api.put(`${"category/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //delete category
    deleteCategory(id: string) {
        return this._api.put(`${"category/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    
}

