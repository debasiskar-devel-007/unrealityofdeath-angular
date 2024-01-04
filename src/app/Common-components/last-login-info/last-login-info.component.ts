import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-last-login-info',
  templateUrl: './last-login-info.component.html',
  styleUrls: ['./last-login-info.component.css'],
  providers: [DatePipe]
})
export class LastLoginInfoComponent {

  constructor(public apiService: ApiservicesService, private cookieService: CookieService, private datePipe: DatePipe) {}

  public user_profile_details: any = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}

  public userName: any = ""
  public loginTime: any = ""
  public affiliateID: any = ""
  public showSkeleton: boolean = true

  public isAffiliateID: boolean = true

  ngOnInit() {
    console.log(this.user_profile_details);

    this.apiService.getHttpDataPost('user-api/fetch-login-detail', {
      uid: this.user_profile_details?.uidval
    }).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response && response.status == 'success') {
          
          this.userName = response.results[0].fullname
          this.loginTime = this.datePipe.transform(response.results[0].login_time, 'MMM d, y, h:mm:ss a')

          if(response.results[0]?.agent_code) {
            this.affiliateID = response.results[0].agent_code
          } else {
            this.isAffiliateID = false
          }

          this.showSkeleton = false
        }
      },
      error: (error: any) => {
        console.log(error);
        
      }
    })

    
  }
}
