import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public router: Router, public activateRoute: ActivatedRoute, private cookieService: CookieService, public matSnackBar: MatSnackBar, private apiservice: ApiservicesService) {
    window.scroll(0, 0);
  }

  public user_profile_details:any = this.cookieService.get('login_user_details')? JSON.parse(this.cookieService.get('login_user_details')) : {}
  public classToggled:boolean = false

  public frontendurl:string = environment.stage == 'prod'? 'https://psycheandsingularity.com/': 'https://dev.timothydesmond.influxiq.com/'


  public toggleNav() {
    console.log('aaaa');
    this.classToggled = !this.classToggled;
  }

  navigateToPath(path: string) {
    console.log("path==========>", path)
    this.router.navigateByUrl(path)
  }
  currentPath(): string {
    return this.router.url
    
  }

  myAccount(){

    console.log(this.user_profile_details);
    this.router.navigateByUrl(`my-account/account-info`)
    

  }
  conversionReportClick() {
    if (this.user_profile_details.roleval === 3) this.router.navigateByUrl(`affiliate-dashboard/report/conversion-report`);
   
  }
clickReportClick() {
    if (this.user_profile_details.roleval === 3) this.router.navigateByUrl(`affiliate-dashboard/report/click-report`);
   
  }

  changePass(){}

  logout(){
    this.cookieService.deleteAll('login_user_details')
    this.cookieService.deleteAll('loggedin_user')

    let cookieVal = this.getCookieByName('login_user_details')
    if(cookieVal){
      if(cookieVal.includes('login_user_details')){
        document.cookie = `login_user_details=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `loggedin_user=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    }
    
    this.matSnackBar.open("Logout Successfully", "Ok", {
      duration: 3000
    });
    setTimeout(()=>{
      this.router.navigateByUrl('/')
    }, 3000)
  }

  getCookieByName(name:string) {
    const value = document.cookie;
    if (value.includes(name)) {
        console.log("value====>", value)
        let userVal = value.split(`${name}=`)[1]?.split(';')[0]
        console.log("userVal=====>", userVal)
        if (userVal) {
            return userVal
        } else {
            return null
        }
    } else {
        return null
    }
}

}
