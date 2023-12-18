import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { PreviewComponent } from 'src/app/Common-components/preview/preview.component';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-campaignmodal',
  templateUrl: './campaignmodal.component.html',
  styleUrls: ['./campaignmodal.component.css'],
})
export class CampaignmodalComponent {
  public tabledatatalist: any = [];

  public campainAllData: any = [];

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<CampaignmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private clipBoard: Clipboard
  ) {
    console.log(data);
    this.campainAllData = data;
  }

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
    buttons: [
      // {
      //   label: 'Add Assay',
      //   type: 'button',
      //   name: 'add_taxonomies',
      //   tooltip: 'Add Taxonomies',
      //   classname: 'add_adminBTN',
      // },
    ],
  };
  libdata: any = {
    basecondition: {},

    detailview_override: [
      // { key: "campaign_name", val: "Campaign Name" },
      // { key: "landing_page_name", val: "Landing Page" },
      // { key: "description", val: "Description" },
      // { key: "lastname", val: "lastname" },
    ],
    hidedeletebutton: true,
    hideviewbutton: true,
    hideeditbutton: true,
    hidestatustogglebutton: false,
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
      {
        label: 'Edit',
        type: 'listner',
        id: 'edit_btn',
        tooltip: 'Edit',
        name: 'edit',
        cond: 'default_val',
        condval: 1,
        classname: 'edit_btn',
      },
      {
        label: 'Preview',
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist: [
          'campaign_name',
          'campaign_url',
          'description',
          'landing_page_name',
          'unique_name',
          'created_on',
          'status',
        ],
      },
      {
        label: 'Delete',
        type: 'listner',
        id: 'delete_btn',
        tooltip: 'Delete',
        cond: 'default_val',
        condval: 1,
        name: 'delete',
        classname: 'delete_btn',
      },
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
      opportunity_id: this.campainAllData?.campaignVal,
    };

    console.log(this.cookieData);

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

    //  this.userListFetching()
    // Subscribe to list data fetching
  }

  fetchlist() {
    this.apiService
      .getHttpDataPost('marketing/campaign-list', {
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
        if (response.results.res.length > 0) {
          this.tabledatatalist = [];
          setTimeout(() => {
            this.tabledatatalist = response.results.res;
          });

          const targetElem = this.elementRef.nativeElement.querySelector('#modalcamplist');

      if(targetElem) {        
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
        }
      });
  }
  fetchlistCount() {
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

        const targetElem = this.elementRef.nativeElement.querySelector('#modalcamplist');

        if(targetElem) {        
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
        }
      });
  }

  onLiblistingButtonChange(val: any) {}
  listenLiblistingChange(data: any = null) {
    console.log('test', data);

    if (data?.custombuttonclick?.btninfo.id == 'edit_btn') {
      this.campainAdd(
        data.custombuttonclick.data.landing_page_name,
        data.custombuttonclick.data,
        'edit'
      );
      console.log('aaaaaaaaaaa', data.custombuttonclick.data);
    }
    if (
      data.action === 'custombuttonclick' &&
      data.custombuttonclick.btninfo.id === 'preview_btn' &&
      data.custombuttonclick.data
    ) {
      this.dialog.open(PreviewComponent, {
        panelClass: 'custom-modalbox',
        data: {
          key: data.custombuttonclick.btninfo.previewlist,
          value: data.custombuttonclick.data,
        },
      });
    }
    if (
      data.action === 'custombuttonclick' &&
      data.custombuttonclick.btninfo.id === 'delete_btn' &&
      data.custombuttonclick.data
    ) {
      const dialogRef = this.dialog.open(confirmationModal, {
        panelClass: 'custom-modalbox',
        data: data.custombuttonclick.data?.campaign_id,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);

        this.fetchlist();
        this.fetchlistCount();
      });
    }

    if (data?.custombuttonclick?.btninfo.id == 'copy_btn') {
      this.clipBoard.copy(data?.custombuttonclick?.data?.campaign_url);
      this.matSnackBar.open('Copied To Clipboard!', 'ok', { duration: 2000 });
    }
  }

  campainAdd(landingName: any, data: any = null, flag: any = 'add') {
    console.log(landingName);

    const dialogRef = this.dialog.open(addCampainModal, {
      panelClass: 'custom-modalbox',
      data: {
        heading: 'Alert!!',
        setDefaultObj: {
          user_id: this.cookieData?.uidval,
          opportunity_id: this.campainAllData?.campaignVal,
          edit_data: data,
          landingName: landingName,
          flag: flag,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.fetchlist();
      this.fetchlistCount();

    });
  }
}

// << -------------- Campain Add Modal ---------------- >>

@Component({
  selector: 'addCampainModal',
  templateUrl: './addcampaign.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class addCampainModal {
  public landingPageName: any = '';

  constructor(
    private cookieService: CookieService,
    private apiservice: ApiservicesService,
    public matSnackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private dialogRef: MatDialogRef<addCampainModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data========>+', data);
    this.landingPageName = data?.setDefaultObj?.landingName;
  }

  public configFormData = {};
  // public landingarrayvalue: any = []
  public formfieldrefresh: any = null;
  public formfieldrefreshdata: any = null;
  public dropdownvalue: any = [];
  public loader: boolean = false;
  public paramsId: any = '';
  formValue: any = {};
  lodedValue: any = {};
  public forUpdate: boolean = false;
  public update_id: any = '';
  public endpoint_resvalue: any = [];

  ngOnInit() {
    if (this.data?.setDefaultObj?.edit_data) {
      this.formValue = this.data?.setDefaultObj?.edit_data;
      this.update_id = this.data?.setDefaultObj?.edit_data?.campaign_id;
      this.forUpdate = true;
    }
    this.addCampainForm();
  }

  addCampainForm() {
    this.configFormData = {
      successmessage: 'Added Successfully !!',
      // submittext: 'Submit',
      submittext: this.forUpdate ? 'Update' : 'Submit',
      apiUrl: this.apiservice.baseUrl,
      canceltext: 'Back To List',
      hidereset: true,
      jwttoken: '',
      fields: [
        {
          label: 'Campaign Name',
          name: 'campaign_name',
          value:
            this.formValue && this.formValue.campaign_name
              ? this.formValue.campaign_name
              : '',
          type: 'text',
          classname: 'aaa',
          validations: [
            { rule: 'required', message: 'Category Name is Required' },
          ],
        },
        {
          label: 'Description',
          class: 'des_wrp',
          name: 'description',
          value:
            this.formValue && this.formValue.description
              ? this.formValue.description
              : '',
          type: 'text',
          validations: [
            { rule: 'required', message: 'Description is Required' },
          ],
        },

        {
          label: 'Active',
          name: 'status',
          value: this.formValue.status ? this.formValue.status : 1,
          type: 'checkbox',
        },
      ],
    };
  }
  closePreview() {
    this.dialogRef.close();
    this.formValue = {};
  }
  listenFormFieldChange(val: any) {
    console.log('buttion clicked', val);
    this.formValue = val.fromval;
    if (this.forUpdate) {
      console.log('beforeloader', this.loader);

      if (val.field === 'fromsubmit' && val.fieldval === 'success') {
        this.loader = true;
        this.apiservice
          .getHttpDataPost('marketing/campaign-update', {
            campaign_id: this.update_id,
            status: this.formValue.status ? 1 : 0,
            priority: 2,
            ...this.formValue,
          })
          .subscribe({
            next: (response: any) => {
              console.log('edit response', response);
              console.log('response', response);
              console.log('afterloader', this.loader);
              this.loader = false;
              this.matSnackBar.open('Updated Successfully', 'OK', {
                duration: 3000,
              });
              setTimeout(() => {
                this.dialogRef.close();
              }, 2000);
            },
            error: (error: any) => {
              console.log('error --------->', error);
              this.loader = false;
              this.matSnackBar.open('Something Went wrong!', '', {
                duration: 5000,
              });
            },
          });
      }
    } else if (!this.forUpdate) {
      console.log('beforeloader', this.loader);

      if (val.field === 'fromsubmit' && val.fieldval === 'success') {
        this.loader = true;
        console.log('afterloader', this.loader);
        this.apiservice
          .getHttpDataPost('marketing/campaign-add', {
            user_id: this.data?.setDefaultObj?.user_id,
            opportunity_id: this.data?.setDefaultObj?.opportunity_id,
            ...this.formValue,
          })
          .subscribe({
            next: (res: any) => {
              console.log('response', res);
              this.loader = false;
              console.log('afterloader', this.loader);
              this.data = res;
              this.matSnackBar.open('Campaign Created Successful', 'Ok', {
                duration: 3000,
              });
              setTimeout(() => {
                this.dialogRef.close();
              }, 2000);
            },
            error: (error: any) => {
              this.loader = false;
              console.log('error --------->', error);
            },
          });
      }
    }

    if (val.field && val.field === 'formcancel') {
      this.dialogRef.close();
    }
  }
}

// << -------------- Campain Add Modal ---------------- >>

@Component({
  selector: 'confirmationModal',
  templateUrl: './confirmationmodal.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule, CommonModule],
})
export class confirmationModal {
  public datavalue: any;
  public value: any;
  public extractedData: any = {};
  public created_on: any;
  public updated_on: any;
  public created_at: any;
  public flag: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<confirmationModal>,
    private apiService: ApiservicesService,
    public matSnackBar: MatSnackBar
  ) {
    this.datavalue = this.data;
    console.log('dtatadtaa====', this.data);
  }
  ngOnInit() {}

  cancel() {
    console.log('console hit');
    this.dialogRef.close();
  }
  confirm() {
    this.apiService
      .getHttpDataPost('marketing/campaign-delete', {
        campaign_id: this.datavalue,
      })
      .subscribe({
        next: (response: any) => {
          this.flag = true;
          console.log('response', response);
          this.matSnackBar.open(response.message, 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close();
        },

        error: (error: any) => {
          console.log('error', error);
        },
      });
  }
}
