import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { CampaignmodalComponent } from '../../campaignmodal/campaignmodal.component';
import { DialogData } from 'listing-angular15';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { PreviewComponent } from 'src/app/Common-components/preview/preview.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent implements OnChanges {
  public currentListType: any = 'click';
  public loader: boolean = false;
  public opportunity_details: any = null;
  constructor(
    public apiService: ApiservicesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    public dialog: MatDialog
  ) {
    console.log(data);
    this.campainAllData = data;
  }

  public typeClick: boolean = true;

  @Input() listType: any;
  @Input() opportunity_details_input: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['listType']?.currentValue ||
      changes['opportunity_details_input']?.currentValue
    ) {
      // console.log("this.currentListType========>",this.currentListType);

      if (changes['opportunity_details_input']?.currentValue) {
        this.opportunity_details =
          changes['opportunity_details_input'].currentValue;
      }

      if (this.currentListType != changes['listType']?.currentValue) {
        // console.log("this.opportunity_details from list type==========>",this.opportunity_details);
        this.currentListType = changes['listType'].currentValue;
        this.updateReportList();
      } else if (this.opportunity_details) {
        // console.log("this.opportunity_details from list else type==========>",this.opportunity_details);
        this.fetchReports();
      }
    }
  }

  updateReportList() {
    this.libdata.basecondition = this.opportunity_details;
    if (this.currentListType && this.currentListType == 'conversion') {
      this.libdata.basecondition.conversion = true;
      this.typeClick = false;
    } else {
      this.typeClick = true;
      delete this.libdata.basecondition.conversion;
    }
    this.updatetable = !this.updatetable;
  }

  fetchReports() {
    this.loader = true;
    this.libdata.basecondition = this.opportunity_details;

    const requestBody: any = {
      condition: {
        limit: 5,
        skip: 0,
      },
      searchcondition: this.opportunity_details,
      sort: {
        type: 'desc',
        field: 'created_on',
      },
      project: {},
      token: '',
    };
    if (this.currentListType && this.currentListType == 'conversion') {
      this.libdata.basecondition.conversion = true;
      this.typeClick = false;
    } else {
      this.typeClick = true;
      delete this.libdata.basecondition.conversion;
    }

    this.apiService
      .getHttpDataPost('click-conversion/dashboard-click-list', requestBody)
      .subscribe({
        next: (response) => {
          // console.log('response===========>',response);
          this.tabledatatalist = response.results.res;
          this.loader = false;
        },
        error: (err) => {
          console.log('err======>', err);
          this.matSnackBar.open(
            err.message ? err.message : 'Something went wrong',
            'ok',
            { duration: 5000 }
          );
          this.loader = false;
        },
      });
    this.apiService
      .getHttpDataPost(
        'click-conversion/dashboard-click-list-count',
        requestBody
      )
      .subscribe({
        next: (response) => {
          console.log('response===========>', response);
          this.date_search_source_count = response.count;
        },
        error: (err) => {
          console.log('err======>', err);
        },
      });
  }

  public tabledatatalist: any = [];
  public campainAllData: any = [];

  public formLoader: boolean = false;
  public progressLoader: boolean = false;
  public datasource: any;
  tabledata_header_skip: any = ['_id'];
  tabledata_detail_skip: any = ['_id', 'usertype'];

  public taxonomy_updatetable: boolean = false;
  public jwttokenformanagebanner = '';

  updatetable: boolean = false;
  tablename = 'Report';
  editroute = '';
  updateendpoint = 'marketing/campaign-update';
  deleteendpoint = 'marketing/campaign-delete';
  datacollection: any = 'click-conversion/dashboard-click-list';
  public listprogressBar: any = false;
  public api_url_for_managebanner = environment.api_url;
  public cookieData = this.cookieService.get('login_user_details')
    ? JSON.parse(this.cookieService.get('login_user_details'))
    : {};
  searchendpoint = 'click-conversion/dashboard-click-list';
  date_search_endpoint: any = 'click-conversion/dashboard-click-list';
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
    created_on: 'Created on',
  };

  search_settings: any = {};
  sortdata: any = {
    type: 'desc',
    field: 'created_on',
    options: ['campaign_name', 'landing_page_name', 'created_on'],
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
    hidestatustogglebutton: true,
    hidemultipleselectbutton: true,
    hideaction: false,
    updateendpoint: 'marketing/campaign-status-change',
    updateendpointmany: 'marketing/campaign-status-change',
    deleteendpointmany: 'marketing/campaign-delete',

    tableheaders: ['campaign_name', 'landing_page_name', 'created_on'],

    colpipes: [
      { type: 'datetime', col: 'created_on', format: 'MMMM D YYYY, h:mm A' },
    ],

    custombuttons: [
      {
        label: 'Preview',
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist: [
          'campaign_name',
          'landing_page_name',
          'affiliate_name',
          'affiliate_number',
          'affiliate_email',
          'unique_name',
          'created_on',
        ],
      },
    ],
  };

  onLiblistingButtonChange(val: any) {}

  listenLiblistingChange(data: any = null) {
    console.log('listenLiblistingChange-------->', data);

    if (
      data?.action == 'custombuttonclick' &&
      data?.custombuttonclick?.btninfo?.id == 'preview_btn' &&
      data?.custombuttonclick?.data
    ) {
      this.dialog.open(PreviewComponent, {
        panelClass: 'custom-modalbox',
        data: {
          key: data?.custombuttonclick?.btninfo?.previewlist,
          value: data?.custombuttonclick?.data,
          flagParam: 'click-conv-prev',
          typeCheck: this.typeClick,
        },
      });
    }
  }
}
