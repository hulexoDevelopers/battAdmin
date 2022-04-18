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
export class orderService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //get all orders
    getAllOrders() {
        return this._api.get(`${"order/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get all customer orders
    getAllCustomerOrders(customerId: string) {
        return this._api.get(`${"order/customer/all/" + customerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all company orders
    getAllCompanyOrders(companyId: string) {
        return this._api.get(`${"order/company/all/" + companyId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get order by id
    getOrderById(orderId: string) {
        return this._api.get(`${"order/byId/" + orderId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update logistic partner of order
    updateLogistic(orderId: string, data) {
        return this._api.put(`${"order/updateLogistic/" + orderId}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update order status
    updateOrderStatus(orderId: string, data) {
        return this._api.put(`${"order/updateOrderStatus/" + orderId}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get order detail
    getOrderDetail(orderId: string) {
        return this._api.get(`${"order/detail/" + orderId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get all plan orders
    getAllPlanOrders(planId: string) {
        return this._api.get(`${"order/plan/all/" + planId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get order stats
    getAllOrderStatsByDate(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('startDate', data.startDate);
        httpParams = httpParams.append('endDate', data.endDate);
        return this._api.get(`${"order/revenue/byDate?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all companies revenue list
    getCompaniesRevenueList(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('startDate', data.startDate);
        httpParams = httpParams.append('endDate', data.endDate);
        return this._api.get(`${"order/companiesRevenues/byDate?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all plan orders
    getOrdersPerDayReport() {
        return this._api.get(`${"order/perDay/report"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get company stats
    getAllCompanyStats(companyId: string) {
        return this._api.get(`${"order/company/stats/" + companyId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get company per day report
    getCompanyperDayReport(companyId: string) {
        let httpParams = new HttpParams();
        // httpParams = httpParams.append('startDate', data.startDate);
        httpParams = httpParams.append('companyId', companyId);
        return this._api.get(`${"order/companyPerDay/report?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get all orders by date
    getOrdersByDate(data) {
        let httpParams = new HttpParams();
        // httpParams = httpParams.append('startDate', data.startDate);
        httpParams = httpParams.append('startDate', data.startDate);
        httpParams = httpParams.append('endDate', data.endDate);
        return this._api.get(`${"order/byDate?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //approved order pause request
    approvedOrderPauseRequest(orderId: string) {
        return this._api.put(`${"order/approvedPauseRequest/" + orderId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //pause order
    pauseOrder(orderId: string, order) {
        return this._api.put(`${"order/pause/" + orderId}`, order)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }
}

