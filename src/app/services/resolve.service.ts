import { Injectable } from '@angular/core';
import { ApiservicesService } from './apiservices.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';

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
    console.log("route==========>", route.routeConfig, route.params, state.url);

    const cookieData = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}

    console.log(cookieData);
    

    if (state.url == ('/affiliate-dashboard')) {
      route.data['requestcondition']['user_id'] = cookieData.uidval
    }
    if (state.url.includes('my-account/account-info')) {
      route.data['requestcondition']['uid'] = cookieData.uidval
    }
    if (state.url == ('/affiliate-dashboard/user')) {
      route.data['requestcondition']['searchcondition']['affiliate_id'] = cookieData.uidval
    }
    if (state.url.includes('report/click-report') || state.url.includes('report/conversion-report') ) {
      let startval = moment().startOf('month').valueOf()
      let endval = moment().endOf('month').valueOf()
      route.data['requestcondition']['searchcondition']['affiliate_id'] = cookieData.uidval
      route.data['requestcondition']['searchcondition']['created_on'] = { "$gte": startval, "$lte": endval } ? { "$gte": startval, "$lte": endval } : undefined
    }
    if (state.url.includes('/affiliate-dashboard/user/user-edit')) {
      route.data['requestcondition']['uid'] = route.params['id']
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
