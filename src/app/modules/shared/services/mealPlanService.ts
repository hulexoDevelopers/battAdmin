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
export class planService {

  constructor(private _api: ApiService,
    private router: Router,
    private http: HttpClient,
    private userService: UserInfoService) { }


  //add new meal plan
  addNewMealPlan(data) {
    return this._api.post(`${"plan/addNew"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }



  //get all meal plans
  getAllMealPlans() {
    return this._api.get(`${"plan/all"}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get plan by plan id
  getPlanById(id: string) {
    return this._api.get(`${"plan/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //update plan
  updateMealPlan(id: string, data: any) {
    return this._api.put(`${"plan/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //delete meal plan
  deleteMealPlan(id: string) {
    return this._api.put(`${"plan/delete/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }


  //get all company plans
  getAllCompanyPlans(id: string) {
    return this._api.get(`${"plan/company/all/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }


  // add new image
  upLoadImage(id: string, image: File) {
    const postData = new FormData();
    postData.append("image", image);
    return this.http

      .put(
        environment.api_url + "plan/uploadImages/" + id,
        postData
      ).pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );

  }


  //update company locations
  updatePlanStates(id: string, data: any) {
    return this._api.put(`${"plan/updateCompanyLocations/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

}

