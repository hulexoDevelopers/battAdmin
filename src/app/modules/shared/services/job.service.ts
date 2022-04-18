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
export class jobService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //add new battery
    addNewJob(data) {
        return this._api.post(`${"job/addNew"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all batteries
    getAllJobs() {
        return this._api.get(`${"job/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get assign job with technician detail
    getInquiryJobsWithTechnicianDetail(id: string) {
        // router.get('/getAllInquiryJobsWithTechnicianDetail/:id', auth, async (req, res) => {
        //get inquiry assign jobs and technician data

        return this._api.get(`${"job/getInquiryJobsWithTechnician/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get busies technicians sorting
    getBusiestTechSorting() {
        return this._api.put(`${"job/busiestTech"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

}

