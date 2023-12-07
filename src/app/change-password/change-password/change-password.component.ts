import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ComingsoonComponent } from 'src/app/Common-components/comingsoon/comingsoon.component';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  public loginForm: FormGroup;

  constructor(private apiService: ApiservicesService, private cookieService: CookieService, public router: Router, public matSnackBar: MatSnackBar, public dialog: MatDialog) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    })
  }

  ngOnInit() {
    const dialogRef = this.dialog.open(ComingsoonComponent, {
      panelClass: ['custom-modalbox', 'comingsoon-modalbox'],
      data: '',
    });
  }


}
