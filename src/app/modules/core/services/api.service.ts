import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient, private route: Router) { }

    private setHeaders(): HttpHeaders {
        const headersConfig = {
            "Content-Type": "application/json",
            Accept: "application/json",

        };
        var token = localStorage.getItem("_auth");
        if (token !== "" && token != null)
            headersConfig["Authorization"] = token;
            headersConfig["key"] = 'data123';
        return new HttpHeaders(headersConfig);
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    get(path: string, httpParams: HttpParams = new HttpParams()): Observable<any> {
        return this.http
            .get(`${environment.api_url}${path}`, {
                headers: this.setHeaders(),
                params: httpParams
            })
            .pipe(catchError(this.formatErrors));
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.http
            .put(`${environment.api_url}${path}`, JSON.stringify(body), {
                headers: this.setHeaders()
            })
            .pipe(catchError(this.formatErrors));
    }

    post(path: string, body: Object = {}): Observable<any> {
        return this.http
            .post(`${environment.api_url}${path}`, JSON.stringify(body), {
                headers: this.setHeaders()
            })
            .pipe(catchError(this.formatErrors));
    }

    // login(path: string, body: any): Observable<any> {
    //     return this.http
    //         .post(`${environment.login_url}${path}`, body)
    //         .pipe(catchError(this.formatErrors));
    // }

    delete(path): Observable<any> {
        return this.http
            .delete(`${environment.api_url}${path}`, { headers: this.setHeaders() })
            .pipe(catchError(this.formatErrors));
    }

}
