import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../../../environments/environment';
import { UserInfoService } from '../../../shared/auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class vehicleService {

  constructor(private _api: ApiService,
    private router: Router,
    private http: HttpClient,
    private userService: UserInfoService) { }


  //add new vehicle
  addNewVehicle(data) {
    return this._api.post(`${"vehicle/addnew"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get all vehicle list
  getAllVehicleList() {
    return this._api.get(`${"vehicle/all"}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //get vehicle by vehicle id
  getVehicleById(id: string) {
    return this._api.get(`${"vehicle/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //update vehicle
  updateVehicle(id: string, data: any) {
    return this._api.put(`${"vehicle/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }

  //delete vehicle
  deleteVehicle(id: string) {
    return this._api.put(`${"vehicle/delete/" + id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }





}

