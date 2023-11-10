import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  public isAffiliateAuthenticated(): boolean {
    // console.log("this.cookieService", JSON.parse(this.cookieService.get('login_user_details')))
    const userType: any = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')): ''
    if (userType?.roleval == 3) return true
    return false
  }
  public loggedInNavigation(): any {
    
    const userType: any = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')): ''
    console.log("userType============>",userType);
    
    if (userType?.roleval == 3) return 'affiliate-dashboard'

    return false
  }
}