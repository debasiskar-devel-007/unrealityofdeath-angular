import { Injectable } from '@angular/core';
import { ApiservicesService } from './apiservices.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResolveService {
  constructor(public apiService: ApiservicesService, private cookieService: CookieService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,

  ): Observable<any> | Promise<any> | any {
    console.log("this is route data", route);

    let reqBody = route?.data?.['requestcondition'];
    console.log("route==========>", route.routeConfig, route.params['_id'], state.url);

    const cookieData = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}

    console.log(cookieData);
    

    if (state.url == ('/affiliate-dashboard')) {
      route.data['requestcondition']['user_id'] = cookieData.uidval
    }
    if (state.url.includes('my-account/account-info')) {
      route.data['requestcondition']['uid'] = cookieData.uidval
    }
    if (state.url.includes('user')) {
      route.data['requestcondition']['searchcondition']['affiliate_id'] = cookieData.uidval
    }


    return new Promise((resolve, reject) => {
      console.log("route ------->", route);
      // if (reqBody) {
        this.apiService
          .getHttpDataPost(route?.data?.['endpoint'], reqBody)
          .subscribe({
            next: (res: any) => {
              console.log('API Data --------->', res);
              return resolve(res)
              // if (res?.status && res?.status == 'success') return resolve(res);
              // else return true;
            },
            error: (error: any) => {
              console.log('error --------->', error);
              return reject(error)
            }
          });
      // } else {
      //   this.apiService
      //     .getHttpData(route?.data?.['endpoint'])
      //     .subscribe({
      //       next: (res: any) => {
      //         console.log('API Data --------->', res);
      //         return resolve(res)
      //         // if (res?.status && res?.status == 'success') return resolve(res);
      //         // else return true;
      //       },
      //       error: (error: any) => {
      //         console.log('error --------->', error);
      //         return reject(error)
      //       }
      //     });
      // }
    });
  }
  

}
