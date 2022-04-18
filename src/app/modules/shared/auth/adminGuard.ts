import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable()

export class adminGuard implements CanActivate {

  constructor(
    private router: Router,
  ) {
  }


  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  canActivate() {
    if (localStorage.getItem('_auth')) {
      let user = this.getDecodedAccessToken(localStorage.getItem('_auth'))
      if (user._id && user.role == "supAdmin") {
        let exp = user.exp
          if (exp && exp <= Date.now()/1000){
            this.router.navigate(['/user/login']);
            return false;
         } else {
          return true; //True if the token has not the expiration time field
       }
      // }
        // return true
      } else {
        this.router.navigate(['/user/login']);
        return false;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
}






