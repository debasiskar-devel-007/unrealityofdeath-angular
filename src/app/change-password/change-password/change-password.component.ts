import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  public changePassForm: FormGroup;

  constructor(private apiService: ApiservicesService, private cookieService: CookieService, public router: Router, public matSnackBar: MatSnackBar, public dialog: MatDialog) {
    this.changePassForm = new FormGroup({
      oldpass: new FormControl('', Validators.required),
      newpass: new FormControl('', Validators.required),
      confpass: new FormControl('', Validators.required),
    })
    
  }

  public cookieData: any = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : '';

  public loader: boolean = false;
  hide = true;
  hide1 = true;
  hide2 = true;

  ngOnInit() {

    console.log(this.cookieData);
    
    
  }

  handlevisible(event:any){
    event.preventDefault()
    this.hide = !this.hide
   }
   handlevisible1(event:any){
    event.preventDefault()
    this.hide1 = !this.hide1
   }
   handlevisible2(event:any){
    event.preventDefault()
    this.hide2 = !this.hide2
   }

  //  get oldpass() {
  //   return this.changePassForm.get('oldpass')
  //  }
  //  get newpass() {
  //   return this.changePassForm.get('newpass')
  //  }
  //  get confpass() {
  //   return this.changePassForm.get('confpass')
  //  }

   goBack() {
    this.router.navigateByUrl('/affiliate-dashboard')
  }

  goToAccount() {
    this.router.navigateByUrl('/my-account/account-info')
  }

   changePassword() {

    this.loader = true

    let reqBody = {
      oldpassword: this.changePassForm?.value?.oldpass,
      newpassword: this.changePassForm?.value?.newpass,
      uid: this.cookieData?.uidval,
      firstname: this.cookieData?.username.split(" ")[0],
      lastname: this.cookieData?.username.split(" ")[1],
      email: this.cookieData?.useremail,
    }

    console.log(this.changePassForm.controls);    

    // return

    this.apiService.getHttpDataPost('user-api/reset-password', reqBody).subscribe({
      next: (response: any) => {
        console.log(response);

        if(response.status === 'success') {

          this.matSnackBar.open("Password Changed Successfully", '', {
            duration: 5000,
          })

          this.router.navigateByUrl('/affiliate-dashboard');

          this.loader = false;

        } else {
          this.matSnackBar.open(response?.message.length ? response.message : 'Something went Wrong!!', '', {
            duration: 5000,
          });
          this.loader = false;        
        }
        
        
      },
      error: (error: any) => {
        console.log(error);
        this.matSnackBar.open("Something went Wrong!!", '', {
          duration: 5000
        })
        this.loader = false
      },
    })

   }


}
