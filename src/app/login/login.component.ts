import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ApiservicesService } from '../services/apiservices.service';
// import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
// import { MatFormFieldModule } from "@angular/material/form-field";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../assets/login.css'],
})
export class LoginComponent {
  public loginForm: FormGroup;
  public loader: boolean = false;
  public not_Varifed: boolean = false
  private userIp: string = 'false';
  private unsubscriber: Subject<void> = new Subject<void>();
  public errors: any
  public loginButtonStatus: boolean = false

  hide = true;
  constructor(private apiService: ApiservicesService, private cookieService: CookieService, public router: Router, public matSnackBar: MatSnackBar, public dialog: MatDialog) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    })
  }
  ngOnInit() {
    console.log("NODE_ENV===============+>", environment.stage);

    this.buildDatabaseConn()

    console.log("this is login form value", this.loginForm);
    history.pushState(null, '');

    fromEvent(window, 'popstate').pipe(
      takeUntil(this.unsubscriber)
    ).subscribe((_) => {
      history.pushState(null, '');
    });
  }



  handleInputChange(data: any) {
    if (data.target.name === "email") {
      this.errors = { ...this.errors, email: '' }
    }

    if (data.target.name === "password") {
      this.errors = { ...this.errors, password: '' }
    }

    if (data.key === "Enter") {
      this.login()
    }
  }

  buildDatabaseConn(){
    this.apiService.getHttpData('user-api/fetch-states').subscribe({
      next:(response)=>{
        console.log("response========>",response);
        
      }
    })
  }


  login() {

    if (this.loginForm.value.email === "") {
      this.errors = { ...this.errors, email: "Email is required" }
    } else if (this.loginForm.value.password === "") {
      this.errors = { ...this.errors, password: "Password in required" }
    } else {
      // console.log("loginForm", this.loginForm.value)

      this.loader = true;
      // console.log("loginForm", this.loginForm.value)

      this.apiService.getHttpDataWithoutBaseUrl(`https://ipinfo.io/?token=a8778567b02081`).subscribe({
        next: (ipresponse: any) => {

          this.apiService.getHttpDataPost("login/loginsubmission", {
            ...this.loginForm.value,
            login_time: new Date().getTime(),
            ipinfo: ipresponse
          }).subscribe({
            next: (response: any) => {

              if (response.status === "success") {
                this.cookieService.set('login_user_details', JSON.stringify(response.results[0]), { path: '/', });
                this.cookieService.set('loggedin_user', 'true', { path: '/', });
                this.loader = false;

                this.matSnackBar.open(response.message, "Ok", {
                  duration: 3000
                })
                // console.log("affiliate-dashboard========++>", response.results[0].roleval);

                if (response.results[0].roleval == 3) {
                  // console.log("response.results[0].roleval", response.results[0].roleval);

                  this.router.navigateByUrl(`/affiliate-dashboard`);
                }
              } else {

                this.matSnackBar.open(response.message, "Ok", {
                  duration: 3000
                })
                this.loader = false;

              }
            },


            error: (error: any) => {
              this.loader = false;

              // console.log("this is loging error data", error);
              if (error?.results?.user && error?.results?.user === 'inactiv') {
                this.matSnackBar.open(error.results.message, "Ok", { duration: 3000 })
              }
              else {
                this.matSnackBar.open(error.message, "Ok", { duration: 5000 })
              }


              // console.log("email_dfsdf", this.loginForm.value.email);



              //  if(error.not_Varifed === true){
              //    this.apiService.getHttpData("user/request-verification-code?username="+this.loginForm.value.email).subscribe((res:any)=>{

              //    })
              //   //  setTimeout(() => {
              //   // this.dialog.open(OtpVerificationComponent, {
              //   //      data:{"not_Varifed":error.not_Varifed,"email":this.loginForm.value.email.split(" ").join(""),login:this.login},
              //   //    });
              //   //  },1000)

              //   const dialogRef = this.dialog.open(OtpVerificationComponent,{

              //      data:{"not_Varifed":error.not_Varifed,"email":this.loginForm.value.email.split(" ").join(""),login:this.login},

              //   })

              //   this.loginButtonStatus=true

              //   dialogRef.afterClosed().subscribe((result) => {
              //     // console.log("this is login opt dilog close",result);
              //     this.login()

              //   })

              //  }


            }
          })
        }
      })
    }
  }





  handlenter(e: any) {
    this.hide = true
    console.log("enter click", e.key);

    if (e.key === "Enter") {
      this.login()
    }

  }

  handlevisibl(event: any) {
    event.preventDefault()
    this.hide = !this.hide
  }


}


