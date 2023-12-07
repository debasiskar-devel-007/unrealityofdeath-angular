import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
      oldpass: new FormControl(''),
      newpass: new FormControl(''),
      confpass: new FormControl(''),
    })
  }

  public loader: boolean = false;
  hide = true;

  ngOnInit() {
    
  }

  handleInputChange(data:any){
    
  }

  handlevisibl(event:any){
    event.preventDefault()
    this.hide = !this.hide
   }


}
