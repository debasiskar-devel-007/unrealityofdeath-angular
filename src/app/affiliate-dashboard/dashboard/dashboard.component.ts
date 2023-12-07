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
import { ComingsoonComponent } from 'src/app/Common-components/comingsoon/comingsoon.component';
import { DashboardReportModalComponent } from '../dashboard-report-modal/dashboard-report-modal.component';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';

import * as copy from 'copy-to-clipboard';
import { QRCodeModule } from 'angularx-qrcode';

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
    private clipBoard: Clipboard,
    private elementRef: ElementRef,
    { nativeElement }: ElementRef<HTMLImageElement>,
    public sanitizer: DomSanitizer
  ) {
    const supports = 'loading' in HTMLImageElement.prototype;

    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    } else {
      // fallback to IntersectionObserver
    }
  }

  public cookieData: any = {};

  public campaignData: any = [];

  public allCampaigns: any = [];

  public eventValue: any = '';

  public copiedVal: any = '';
  // public mainIndex: number = 0;
  public selected_campaign_index: any = [];

  public loader: boolean = false;

  public banner_data: any = [];

  public banner_sliced_data: any = [];
  public banner_slice: any = 4;

  public disable_loadmore: boolean = false;
  public disable_showless: boolean = true;

  public share_url: any = [];
  public emailTemplateData: any = [];

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

      dialogRef.afterClosed().subscribe((result) => {
        this.dashboardCampaignListApi();
        this.getBanner();
      });
    } else {
      this.loader = true;
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
                this.loader = false;
              }
            } else {
              this.loader = false;
            }
          },
          error: (error: any) => {
            console.log('error', error);
            this.loader = false;
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

    this.getBanner();
    this.fetchAllCampaign();
  }

  dashboardCampaignListApi() {
    this.loader = true;
    this.apiService
      .getHttpDataPost('marketing/dashboard-campaign-list', {
        user_id: this.cookieData.uidval,
      })
      .subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.response.length > 0) {
            this.campaignData = response.response;
            this.loader = false;
          } else {
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.log('error', error);
          this.loader = false;
        },
      });
  }

  copyToClipboard(url: string): void {
    this.clipBoard.copy(url);
    this.matSnackBar.open('Copied To Clipboard!', 'ok', { duration: 2000 });
  }

  selectedindex(index: any, camp_index: any) {
    console.log('selectedindex hit', index, camp_index);
    // if(this.selected_campaign_index[camp_index]==null)
    this.selected_campaign_index[camp_index] = index;
    console.log(this.selected_campaign_index, 'this.selected_campaign_index');
  }

  // valuechange(camp_index: any) {
  //   console.log('func hit', camp_index);
  // }

  getBanner() {
    this.loader = true;
    this.apiService
      .getHttpData(
        `banner-management/fetch-all-banner/${this.cookieData.uidval}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('this is video data', response);

          this.banner_data = response.results;

          if (this.banner_data.length > 0) {
            this.banner_sliced_data = this.banner_data.slice(
              0,
              this.banner_slice
            );
            console.log(this.banner_sliced_data);
          }
          if (this.banner_data.length <= 4) {
            this.disable_loadmore = true;
          }
        },
        error: (error: any) => {
          console.log('this is video error', error);
          this.loader = false;
        },
      });
  }

  loadBanner() {
    this.matSnackBar.open('New Data Loaded Successfully', 'Ok', {
      duration: 3000,
    });

    this.disable_showless = false;
    this.banner_slice = this.banner_slice + 4;
    this.banner_sliced_data = this.banner_data.slice(0, this.banner_slice);

    if (this.banner_data.length <= this.banner_slice) {
      this.disable_loadmore = true;
      this.disable_showless = false;
    }
  }

  collapseBanner() {
    this.matSnackBar.open('Less Data Loaded Successfully', 'Ok', {
      duration: 3000,
    });

    const targetElement =
      this.elementRef.nativeElement.querySelector('#bannerSection');
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }

    this.banner_slice = 4;
    this.banner_sliced_data = this.banner_data.slice(0, this.banner_slice);

    this.disable_loadmore = false;
    this.disable_showless = true;
  }

  // << -------------- All Campaign Fetch Function ---------------- >>

  fetchAllCampaign() {
    this.loader = true;
    this.apiService
      .getHttpDataPost('marketing/all-campaign-data', {
        user_id: this.cookieData.uidval,
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 'success' && response.response.length > 0) {
            this.allCampaigns = response.response;
            this.loader = false;
          } else {
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

  // << -------------- All Campaign Fetch Function ---------------- >>

  // bannerCampaignIndex(data: any, index: any) {
  //   console.log("data", data);
  bannerCampaignIndex(optionIndex: any, index: any) {
    console.log('data', optionIndex);
    console.log('data', index);

    this.share_url[index] = optionIndex;

    console.log('data', this.share_url);
  }

  // bannerCampSelect(event: MatSelectChange) {
  //   console.log(event);

  //   const targetElement = this.elementRef.nativeElement.querySelector('#sharebutton');

  //   console.log("MatSelectChange", event.source);
  //   console.log("MatSelectChange==", targetElement);

  //   this.share_url = event.source

  //   // if(event.source._id)
  //   console.log("bannner select field ", event.source._elementRef.nativeElement);

  //   let selectid = event.source._elementRef.nativeElement.id

  //   if (event.source._elementRef.nativeElement.id == selectid) {

  //     targetElement.setAttribute("disabled", "false");
  //   }
  // }

  emailOptionSelect(optionIndex: any, templateNumber: any) {
    console.log('optionIndex============>', optionIndex, templateNumber);
    this.emailTemplateData[templateNumber] = optionIndex;
  }

  copyEmailTemplate(idVal: any) {
    console.log('idVal===========>', idVal);
    let htmlVal: any = document.getElementById(idVal)?.innerHTML;
    console.log(htmlVal);

    copy(htmlVal, {
      debug: true,
      format: 'text/html',
      onCopy: (text) => {
        console.log(text);
      },
    });
    this.matSnackBar.open('Copied To Clipboard!', 'Ok', { duration: 2000 });
  }

  // << -------- Campaign Modal ----------- >>

  campaignModal(campaignVal: any) {
    this.loader = true;
    this.apiService
      .getHttpDataPost('marketing/campaign-list', {
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
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 'success') {
            this.loader = false;
            const dialogRef = this.dialog.open(CampaignmodalComponent, {
              panelClass: ['custom-modalbox', 'campainlist_modalbox'],
              data: {
                setDefaultObj: response.results.res,
                campaignVal: campaignVal,
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              this.dashboardCampaignListApi();
              this.getBanner();
            });
          } else {
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

  // << -------- Campaign Modal ----------- >>

  // << -------------- Landing Page Choose Modal ---------------- >>

  chooseLandingpage() {
    const dialogRef = this.dialog.open(chooseLandingpageModal, {
      panelClass: ['custom-modalbox', 'landingchoose-modalbox'],
      data: this.campaignData,
    });
  }

  // << -------------- Landing Page Choose Modal ---------------- >>

  // << -------------- All Campaign Fetch Modal ---------------- >>

  allCampaignShow() {
    this.loader = true;

    this.apiService
      .getHttpDataPost('marketing/campaign-list', {
        condition: {
          limit: 5,
          skip: 0,
        },
        searchcondition: {
          user_id: this.cookieData.uidval,
        },
        sort: {
          type: 'desc',
          field: 'created_on',
        },
        project: {},
        token: '',
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 'success') {
            const dialogRef = this.dialog.open(allCampaignModal, {
              panelClass: ['custom-modalbox', 'campainlist_modalbox'],
              data: {
                setDefaultObj: response.results.res,
              },
            });
            this.loader = false;
          } else {
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

  // << -------------- All Campaign Fetch Modal ---------------- >>

  // << -------------- Coming Soon Modal ---------------- >>

  comingSoon() {
    const dialogRef = this.dialog.open(ComingsoonComponent, {
      panelClass: ['custom-modalbox', 'comingsoon-modalbox'],
      data: '',
    });
  }

  // << -------------- Coming Soon Modal ---------------- >>

  // << ------------ QR Modal --------------- >>

  showQrCode(val: any, index: any) {
    console.log(val, index);

    const url_index =
      (index || index == 0) &&
      this.selected_campaign_index.length > 0 &&
      this.selected_campaign_index[index]
        ? this.selected_campaign_index[index]
        : 0;

    const dialogRef = this.dialog.open(QRCodeModal, {
      data: {
        ...val,
        index: url_index,
      },
      panelClass: ['custom-modalbox', 'qr-modalbox'],
    });
  }

  // << ------------ QR Modal --------------- >>

  clickConversionModal(val: any) {
    console.log('click conversion data==========>', val);

    const dialogRef = this.dialog.open(DashboardReportModalComponent, {
      panelClass: ['custom-modalbox', 'campainlist_modalbox'],
      data: {
        opportunity_data: {
          base_name_identifier: val.base_name_identifier,
          opportunities_id: val.opportunity_id,
        },
      },
    });
  }

  // << -------------- Coming Soon Modal ---------------- >>
}

// << ------------------ Unique Url Modal Component ----------------- >>

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
  ) {}

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
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%&*]{8,}$/),
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
      .subscribe((response) => {
        console.log('respodfdsfnce', response);

        if (response.status === 'success') {
          if (response.has === false) {
            this.hasunic = 1;
          } else if (response.has === true) {
            this.hasunic = 2;
          }
          this.unicLoader = false;
        } else {
          this.unicLoader = false;
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
    this.loader = true;
    const login_user_details = this.cookieService.get('login_user_details')
      ? JSON.parse(this.cookieService.get('login_user_details'))
      : {};

    console.log(login_user_details);

    if (this.validflag == 1 && this.hasunic === 1) {
      this.apiService
        .getHttpDataPost('marketing/create-unique_identifier', {
          uid: login_user_details.uidval,
          unique_name: this.unic_value,
          skip_identifier: 0,
        })
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
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
              this.loader = false;
            } else {
              this.loader = false;
            }
          },
          error: (error: any) => {
            console.log('error', error);
            this.loader = false;
          },
        });
    }
  }
}

// << ------------------ Unique Url Modal Component ----------------- >>

// << ------------------ Landing Page Choose Modal Component ----------------- >>

@Component({
  selector: 'chooseLandingpageModal',
  templateUrl: './choose-landingpage.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class chooseLandingpageModal {
  public chooseLandingData: any = [];

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<chooseLandingpageModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {
    console.log(data);
    this.chooseLandingData = data;
  }

  public cookieData: any = this.cookieService.get('login_user_details')
    ? JSON.parse(this.cookieService.get('login_user_details'))
    : {};

  public loader: boolean = false;

  ngOnInit() {}

  chosenLandingCampaign(idVal: any) {
    console.log(idVal);
    this.loader = true;

    this.apiService
      .getHttpDataPost('marketing/campaign-list', {
        condition: {
          limit: 5,
          skip: 0,
        },
        searchcondition: {
          user_id: this.cookieData.uidval,
          opportunity_id: idVal,
        },
        sort: {
          type: 'desc',
          field: 'created_on',
        },
        project: {},
        token: '',
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 'success') {
            const dialogRef = this.dialog.open(CampaignmodalComponent, {
              panelClass: ['custom-modalbox', 'campainlist_modalbox'],
              data: {
                setDefaultObj: response.results.res,
                campaignVal: idVal,
              },
            });

            this.loader = false;
          } else {
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.log(error);
          this.loader = false;
        },
      });
  }
}

// << ------------------ Landing Page Choose Modal Component ----------------- >>

// << ------------------ All Campaign Modal Component ----------------- >>

@Component({
  selector: 'allCampaignModal',
  templateUrl: './allcampaign-modal.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class allCampaignModal {
  public campainAllData: any = [];

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<allCampaignModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    private clipBoard: Clipboard
  ) {
    console.log(data);
    this.campainAllData = data;
  }

  public tabledatatalist: any = [];

  public formLoader: boolean = false;
  public progressLoader: boolean = false;
  public datasource: any;
  tabledata_header_skip: any = ['_id'];
  tabledata_detail_skip: any = ['_id', 'usertype'];

  updatetable: boolean = false;
  tablename = 'campaign';
  editroute = '';
  updateendpoint = 'marketing/campaign-update';
  deleteendpoint = 'marketing/campaign-delete';
  datacollection: any = 'marketing/campaign-list';
  public listprogressBar: any = false;
  public api_url_for_managebanner = environment.api_url;
  public cookieData = this.cookieService.get('login_user_details')
    ? JSON.parse(this.cookieService.get('login_user_details'))
    : {};
  searchendpoint = 'marketing/campaign-list';
  date_search_endpoint: any = 'marketing/campaign-list';
  date_search_source: any = 'campaign';
  date_search_source_count: any = 0;
  Tabledata_header_skip: any = ['_id'];
  limitcond: any = {
    limit: 5,
    skip: 0,
    pagecount: 1,
  };
  statusarray: any = [
    { val: 1, name: 'Active' },
    { val: 0, name: 'Inactive' },
  ];
  rolearray: any = [];
  modify_header_array: any = {
    campaign_name: 'Campaign Name',
    landing_page_name: 'Landing Page',
    status: 'Status',
    created_on: 'Created on',
  };

  search_settings: any = {};
  sortdata: any = {
    type: 'desc',
    field: 'created_on',
    options: ['campaign_name', 'landing_page_name', 'status', 'created_on'],
  };

  public customlistenbutton: any = {
    flag: true,
    tooltipflag: true,
    buttons: [],
  };
  libdata: any = {
    basecondition: {},

    detailview_override: [],
    hidedeletebutton: true,
    hideviewbutton: true,
    hideeditbutton: true,
    hidestatustogglebutton: true,
    hidemultipleselectbutton: true,
    hideaction: false,
    updateendpoint: 'marketing/campaign-status-change',
    updateendpointmany: 'marketing/campaign-status-change',
    deleteendpointmany: 'marketing/campaign-delete',

    tableheaders: [
      'campaign_name',
      'landing_page_name',
      'created_on',
      'status',
    ],

    colpipes: [
      { type: 'datetime', col: 'created_on', format: 'MMMM D YYYY, h:mm A' },
    ],

    custombuttons: [
      //  {
      //    label: 'Edit',
      //    type: 'listner',
      //    id: 'edit_btn',
      //    tooltip: 'Edit',
      //    name: 'edit',
      //    cond: 'default_val',
      //    condval: 1,
      //    classname: 'edit_btn',
      //  },
      //  {
      //    label: 'Preview',
      //    type: 'listner',
      //    id: 'preview_btn',
      //    tooltip: 'Preview',
      //    name: 'preview_btn',
      //    classname: 'previewButton',
      //    previewlist: [
      //      'campaign_name',
      //      'campaign_url',
      //      'description',
      //      'landing_page_name',
      //      'unique_name',
      //      'created_on',
      //      'status',
      //    ],
      //  },
      //  {
      //    label: 'Delete',
      //    type: 'listner',
      //    id: 'delete_btn',
      //    tooltip: 'Delete',
      //    cond: 'default_val',
      //    condval: 1,
      //    name: 'delete',
      //    classname: 'delete_btn',
      //  },
      {
        label: 'Copy',
        type: 'listner',
        id: 'copy_btn',
        tooltip: 'Copy',
        name: 'copy',
        classname: 'copy_btn',
      },
    ],
  };
  public taxonomy_updatetable: boolean = false;
  public jwttokenformanagebanner = '';

  ngOnInit() {
    this.libdata.basecondition = {
      user_id: this.cookieData?.uidval,
    };

    this.tabledatatalist = this.campainAllData?.setDefaultObj
      ? this.campainAllData?.setDefaultObj
      : [];

    this.apiService
      .getHttpDataPost('marketing/campaign-list-count', {
        condition: {
          limit: 5,
          skip: 0,
        },
        searchcondition: {
          user_id: this.cookieData?.uidval,
          opportunity_id: this.campainAllData?.campaignVal,
        },
        sort: {
          type: 'desc',
          field: 'created_on',
        },
        project: {},
        token: '',
      })
      .subscribe((response: any) => {
        if (response && response.count) {
          this.date_search_source_count = response.count;
        }
      });
  }

  onLiblistingButtonChange(val: any) {}
  listenLiblistingChange(data: any = null) {
    console.log('test', data);

    if (data?.custombuttonclick?.btninfo.id == 'copy_btn') {
      this.clipBoard.copy(data?.custombuttonclick?.data?.campaign_url);
      this.matSnackBar.open('Copied To Clipboard!', 'ok', { duration: 2000 });
    }
  }
}

// << ------------------ All Campaign Modal Component ----------------- >>

// << ------------------ QRCode Modal Component ----------------- >>

@Component({
  selector: 'QRCodeModal',
  templateUrl: 'qrcode-modal.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    SharedModule,
    QRCodeModule,
    CommonModule,
  ],
})
export class QRCodeModal {
  public dialogData: any = {};
  public qrData: any = null;

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<QRCodeModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {
    console.log(data);
    this.dialogData = data;
    this.qrData = this.dialogData.campaign_url[this.dialogData.index];
  }
}

// << ------------------ QRCode Modal Component ----------------- >>
