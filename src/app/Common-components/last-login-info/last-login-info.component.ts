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

  public user_profile_details:any = this.cookieService.get('login_user_details')? JSON.parse(this.cookieService.get('login_user_details')) : {}

  public userName: any = ""
  public loginTime: any = ""
  public showSkeleton: boolean = true

  ngOnInit() {
    console.log(this.user_profile_details);

    this.apiService.getHttpDataPost('user-api/fetch-login-detail', {
      uid: this.user_profile_details?.uidval
    }).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response && response.status == 'success') {
          this.showSkeleton = false
          this.userName = response.results[0].firstname + " " + response.results[0].lastname
          this.loginTime = this.datePipe.transform(response.results[0].login_time, 'MMM d, y, h:mm:ss a')
        }
         
      },
      error: (error: any) => {
        console.log(error);
        
      }
    })
  }
}
