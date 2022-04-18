import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})

export class UserInfoService {
  authToken;
  user;
  private authStatusListener = new Subject<boolean>();
  constructor(
  ) { }

  // auth listener
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getExpire() {
    const timer = JSON.parse(localStorage.getItem('exp'));
    if ((Date.now() > timer)) {
      // this.auth.logout();
      localStorage.clear(); // Clear local storage
    }
  }


  isExpired(exp) {
    if (exp) {
      return exp <= Date.now() / 1000;
    } else {
      return true; //True if the token has not the expiration time field
    }
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  // Function to get token from client local storage
  public getAuthData() {
    const token = localStorage.getItem("_auth");
    if (token) {
      //  const token = localStorage.getItem('token');
      let user = this.getDecodedAccessToken(localStorage.getItem('_auth'))
      return user._id

    }
  }

  // check user role
  public getUserRole() {
    const token = localStorage.getItem("_auth");
    if (token) {
      let user = this.getDecodedAccessToken(localStorage.getItem('_auth'))
      const userrole = user.role
      return userrole

    }
  }


  // Function to get login mail
  // public getEmail() {
  //   const token = localStorage.getItem("_auth");
  //   if (token) {
  //     //  const token = localStorage.getItem('token');
  //     const useremail = decode(token);
  //     return useremail.email

  //   }
  // }

  //logout
  logout() {
    // const timer = JSON.parse(localStorage.getItem('exp'));
    // if ((Date.now() > timer)) {
    // this.auth.logout();
    localStorage.clear(); // Clear local storage
    // }
  }


  //logout
  ClearToken() {
    // const timer = JSON.parse(localStorage.getItem('exp'));
    // if ((Date.now() > timer)) {
    // this.auth.logout();
    localStorage.clear(); // Clear local storage
    // }

  }




}

