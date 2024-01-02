import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-last-login-info',
  templateUrl: './last-login-info.component.html',
  styleUrls: ['./last-login-info.component.css'],
})
export class LastLoginInfoComponent {
  constructor(private cookieService: CookieService) {}

  public user_profile_details: any = this.cookieService.get(
    'login_user_details'
  )
    ? JSON.parse(this.cookieService.get('login_user_details'))
    : {};

  ngOnInit() {
    console.log(this.user_profile_details);
  }
}
