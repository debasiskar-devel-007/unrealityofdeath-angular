import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { CampaignmodalComponent } from '../campaignmodal/campaignmodal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    public router: Router,
    public cookieService: CookieService,
    private apiService: ApiservicesService,
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    private clipBoard: Clipboard
  ) { }

  public cookieData: any = {};

  public campaignData: any = [];

  public eventValue: any = '';

  public copiedVal: any = '';
  // public mainIndex: number = 0;
  public selected_campaign_index: any = []


  ngOnInit() {
    this.cookieData = this.cookieService.get('login_user_details')
      ? JSON.parse(this.cookieService.get('login_user_details'))
      : '';

    console.log(this.cookieData);

    if (!this.cookieData.unique_name_val) {
      const dialogRef = this.dialog.open(UniqueUrlModal, {
        panelClass: 'custom-modalbox',
        disableClose: true,
        data: {
          heading: 'Create Your Unique URL!!',
          setDefaultObj: {},
        },
      });
    } else {
      this.apiService
        .getHttpDataPost('marketing/create-unique_identifier', {
          uid: this.cookieData.uidval,
          unique_name: this.cookieData.unique_name_val,
          skip_identifier: 1,
        })
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              if (response.results?.length > 0) {
                this.dashboardCampaignListApi();
              }
            }
          },
          error: (error: any) => {
            console.log('error', error);
          },
        });
    }

    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        console.log(response);

        if (response.data && response.data.response.length > 0) {
          this.campaignData = response.data.response;
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  dashboardCampaignListApi() {
    this.apiService
      .getHttpDataPost('marketing/dashboard-campaign-list', {
        user_id: this.cookieData.uidval,
      })
      .subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.results.length > 0) {
            this.campaignData = response.results;
          }
        },
        error: (error: any) => {
          console.log('error', error);
        },
      });
  }

  copyToClipboard(url: string): void {
    this.clipBoard.copy(url);
    this.matSnackBar.open("Copied To Clipboard!", "ok", { duration: 2000, });
  }

  selectedindex(index: any, camp_index: any) {
    console.log("selectedindex hit", index, camp_index);
    // if(this.selected_campaign_index[camp_index]==null)
    this.selected_campaign_index[camp_index] = index;
    console.log(this.selected_campaign_index, 'this.selected_campaign_index')
  }

  valuechange(camp_index: any) {
    console.log("func hit", camp_index);
  }

  // << -------- Campaign Modal ----------- >>

  campaignModal(campaignVal: any) {
    this.apiService.getHttpDataPost('marketing/campaign-list', {
      condition: {
        limit: 5,
        skip: 0,
      },
      searchcondition: {
        user_id: this.cookieData.uidval,
        opportunity_id: campaignVal,
      },
      sort: {
        type: 'desc',
        field: 'created_on',
      },
      project: {},
      token: '',
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status == 'success') {
          const dialogRef = this.dialog.open(CampaignmodalComponent, {
            panelClass: 'custom-modalbox',
            data: response.response
          })

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
          })
        } else {

        }


      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
}

@Component({
  selector: 'UniqueUrlModal',
  templateUrl: './uniqueurl-modal.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class UniqueUrlModal {
  public prodUrl: any = environment.stage == 'prod' ? true : false;

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<UniqueUrlModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) { }

  public unicUser_form: any;
  public validflag: number = 0;
  public loader: boolean = false;
  public unic_value: string = '';
  public unicLoader: any = false;
  public hasunic: any = 0;
  userQuestionUpdate = new Subject<string>();

  ngOnInit() {
    this.unicUser_form = this.fb.group({
      unique_identifier: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern(/^[a-z0-9-_]+$/),
        ],
      ],
    });

    this.userQuestionUpdate
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log('valieeeeeeedebounce', value);
        this.chekUnicValue(value);
      });
  }

  async chekUnicValue(params: any) {
    this.unicLoader = true;
    this.apiService
      .getHttpDataPost('marketing/unique-name-check', { unique_name: params })
      .subscribe((responce) => {
        console.log('respodfdsfnce', responce);
        this.unicLoader = false;
        if (responce.status === 'success') {
          if (responce.has === false) {
            this.hasunic = 1;
          } else if (responce.has === true) {
            this.hasunic = 2;
          }
        }
      });
  }

  runing(event: any) {
    this.hasunic = 0;
    this.validflag = 0;
    if (event) {
      this.unic_value = event;

      if (this.unicUser_form.status == 'INVALID') {
        this.validflag = 2;
      } else if (this.unicUser_form.status == 'VALID') {
        this.validflag = 1;
        this.userQuestionUpdate.next(event);
      }
    }
  }

  submit() {
    const login_user_details = this.cookieService.get('login_user_details')
      ? JSON.parse(this.cookieService.get('login_user_details'))
      : {};

    console.log(login_user_details);

    if (this.validflag == 1 && this.hasunic === 1) {
      this.loader = true;
      this.apiService
        .getHttpDataPost('marketing/create-unique_identifier', {
          uid: login_user_details.uidval,
          unique_name: this.unic_value,
          skip_identifier: 0,
        })
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.loader = false;
              console.log('success', response);
              let oldcookie = JSON.parse(
                this.cookieService.get('login_user_details')
              );
              let newcookie = {
                ...oldcookie,
                unique_name_val: this.unic_value,
              };
              console.log('oldcookie', oldcookie);

              this.cookieService.set(
                'login_user_details',
                JSON.stringify(newcookie)
              );
              console.log('newcookie', newcookie);

              this.matSnackBar.open('Unique URL Generated Successful', 'Ok', {
                duration: 4000,
              });
              setTimeout(() => {
                this.dialogRef.close();
              }, 2000);
            }
          },
          error: (error: any) => {
            console.log('error', error);
          },
        });
    }
  }
}
