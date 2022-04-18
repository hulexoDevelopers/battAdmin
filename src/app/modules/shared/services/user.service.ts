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


  //get all users
  getAllUsers() {
    return this._api.get(`${"users/all"}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get all technicians
  getAllTechnicians() {
    return this._api.get(`${"users/technicians"}`)
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

  //get user by id 
  getUserById(id: string) {
    return this._api.get(`${"users/byId/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  
  //get user by contact 
  getTechniciansWithActiveJobs() {
    return this._api.get(`${"users/techniciansWithActiveJobs"}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }



  //get user by contact 
  getUserByContact(contactNo: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('contactNo', contactNo)
    return this._api.get(`${"users/byContact?" + httpParams}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get by login user
  getByLoginUser(id: string) {

    return this._api.get(`${"users/byLoginUser/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //update user
  updateUserById(id: string, data) {
    return this._api.put(`${"users/update/" + id}`, data)
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


  //reset password
  resetPassword(data) {
    return this._api.post(`${"users/resetPassword"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }

  //change password
  changePassword(data) {
    return this._api.post(`${"users/changePassword"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }

  //update user
  updateUser(id, data) {
    return this._api.put(`${"users/update/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }


  //delete user
  deleteUser(id) {
    return this._api.put(`${"users/delete/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }



}

