import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    public router: Router,
    public cookieService: CookieService,
    private apiService: ApiservicesService,
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    const dialogRef = this.dialog.open(UniqueUrlModal, {
      panelClass: 'custom-modalbox',
      data: {
        heading: 'Create Your Unique URL!!',
        setDefaultObj: {
          
        },
      },
    });
  }

}

@Component({
  selector: 'UniqueUrlModal',
  templateUrl: './uniqueurl-modal.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class UniqueUrlModal {

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<UniqueUrlModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) {
  }

  public unicUser_form: any;
  public validflag: number = 0
  public loader: boolean = false;
  public unic_value: string = ""
  public unicLoader: any = false
  public hasunic: any = 0
  userQuestionUpdate = new Subject<string>();

  ngOnInit() {
    this.unicUser_form = this.fb.group({
      unique_identifier: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern(/^[a-z0-9-_]+$/)
        ]
      ]
    });


    this.userQuestionUpdate.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        console.log("valieeeeeeedebounce", value);
        this.chekUnicValue(value)

      });


  }


  async chekUnicValue(params: any) {
    this.unicLoader = true
    this.apiService.getHttpDataPost("marketing/unique-name-check", { unique_name: params }).subscribe(responce => {
      console.log("respodfdsfnce", responce);
      this.unicLoader = false
      if (responce.status === "success") {

        if (responce.has === false) {
          this.hasunic = 1
        } else if (responce.has === true) {
          this.hasunic = 2
        }
      }
    })
  }

  runing(event: any) {
    this.hasunic = 0
    this.validflag = 0
    if (event) {
      this.unic_value = event

      if (this.unicUser_form.status == 'INVALID') {
        this.validflag = 2
      } else if (this.unicUser_form.status == 'VALID') {
        this.validflag = 1
        this.userQuestionUpdate.next(event)
      }
    }


  }


  submit() {
    const login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}

    if (this.validflag == 1 && this.hasunic === 1) {
      this.loader = true
      this.apiService.getHttpDataPost("reps/create-unique_identifier", {
        user_id: login_user_details.userinfo._id,
        unique_identifier: this.unic_value,
        skip_identifier: 0
      }).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.loader = false
            console.log("success", response);
            let oldcookie = JSON.parse(this.cookieService.get('login_user_details'))
            let newcookie = {
              lastLoginTime: oldcookie.lastLoginTime,
              token: oldcookie.token,
              token_expiry: oldcookie.token_expiry,
              userinfo: { ...oldcookie.userinfo, unique_identifier: this.unic_value },

            }
            console.log("oldcookie", oldcookie);

            this.cookieService.set('login_user_details', JSON.stringify(newcookie));
            console.log("newcookie", newcookie);

            this.matSnackBar.open('Unique URL Generated Successful', "Ok", {
              duration: 4000
            })
            setTimeout(() => {
              this.dialogRef.close()
            }, 5000)


          }
        },
        error: (error: any) => {
          console.log("error", error);
        }
      })
    }
  }
}