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
export class userService {

  constructor(private _api: ApiService,
    private router: Router,
    private http: HttpClient,
    private userService: UserInfoService) { }


  //add new user
  addNewUser(data) {
    return this._api.post(`${"users/save"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }



  //add new
  loginUser(data) {
    return this._api.post(`${"users/login"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get login user
  getLoginUser() {
    let id = this.userService.getAuthData()
    let httpParams = new HttpParams()
    httpParams = httpParams.append("id", id)
    return this._api.get(`${"users/ById?" + httpParams}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get user by uuid
  getUserByUuid(id) {
    return this._api.get(`${"users/findByUuid/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }

  //change password
  changePassword(data) {
    return this._api.post(`${"users/resetCustomerPassword"}` ,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }



}

