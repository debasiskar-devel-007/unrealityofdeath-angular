import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-conversion-report',
  templateUrl: './conversion-report.component.html',
  styleUrls: ['./conversion-report.component.css']
})
export class ConversionReportComponent {
  public tabledatatalist: any = [];






  public login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')): {};
  public jwttokenformanagebanner = '';
  public api_url_for_managebanner = environment.api_url;
  tabledata_detail_skip: any = ['_id'];

  public taxonomy_updatetable: boolean = false;
  date_search_source_count: any = 10;
  date_search_endpoint: any = 'intake/assaylist';
  date_search_source: any = 'users';
  datacollection: any = this.login_user_details.roleval === 3 ? 'reports/conversion-list-rep' : 'reports/conversion-list-admin';
    
  statusarray: any = [
    { val: 1, name: 'Active' },
    { val: 0, name: 'Inactive' },
  ];
  limitcond: any = {
    limit: 10,
    skip: 0,
    pagecount: 1,
  };

  public modify_header_array: any = {}
  tablename = 'report_convertion';

  sortdata: any = {
    type: 'desc',
    field: '_id',
    options: this.login_user_details.roleval === 3 ? ['campaign_name', 'product_name'] : ['name', 'email', 'conversionCount'],
  };

  constructor(
    public router: Router,
    public cookieService: CookieService,
    public activatedRoute: ActivatedRoute,
    private apiservice: ApiservicesService,
    public dialog: MatDialog
  ) { }
  search_settings: any = {
    datesearch:
      this.login_user_details.roleval === 3
        ? [
          {
            startdatelabel: 'Created On Start Date',
            enddatelabel: 'Created On End Date',
            submit: 'Search',
            field: 'created_on',
            // value: {$gte: createdon_datetime, $lte: 1622962799000}
          },
        ]
        : [
          {
            startdatelabel: 'Created On Start Date',
            enddatelabel: 'Created On End Date',
            submit: 'Search',
            field: 'created_at',
            // value: {$gte: createdon_datetime, $lte: 1622962799000}
          },
        ],

    textsearch:
    this.login_user_details.roleval === 3
        ? [
          {
            label: 'Search By Campaign Name',
            field: 'campaign_name',
          },
          // {
          //   label: "Search By Opportunities", field: 'product_name',
          // },
        ]
        : [
          {
            label: 'Search By Rep Name',
            field: 'name',
          },
        ],
  };
  searchendpoint =  this.login_user_details.roleval === 3 ? 'reports/click-list-rep' : 'reports/conversion-list-admin';

  libdata: any = {
    basecondition:
      this.login_user_details.roleval === 3
        ? {
          user_id: this.login_user_details.userinfo._id,
          // created_on: { $gte: this.startval, $lte: this.endval },
        }
        : {
          // created_at: { $gte: this.startval, $lte: this.endval },
        },
    detailview_override: [
      { key: 'conversionCount', val: 'Conversion Count' },
      { key: 'name', val: 'Name' },
      { key: 'click_count', val: 'Click Count' },
    ],
    hideaction: false,
    hideeditbutton: true, // (hide edit button ) all these button options are optional not mandatory
    hidedeletebutton: true, // (hide delete button)
    hideviewbutton: true, // (hide view button)
    hidestatustogglebutton: true,
    hidemultipleselectbutton: true,
    tableheaders:
    this.login_user_details.roleval === 3
        ? ['campaign_name', 'product_name', 'conversion_count']
        : ['name', 'email', 'conversionCount'],
    deleteendpointmany: '',
    updateendpoint: '',
    custombuttons:  this.login_user_details.roleval === 3 ? [
      {
        label: 'Preview',
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist:
          this.login_user_details.userinfo.user_type === 'is_rep'
            ? ['campaign_name', 'product_name', 'click_count']
            : ['name', 'email', 'clickCount'],
      },
      // {
      //   label: 'Chart',
      //   type: 'listner',
      //   id: 'chart_btn',
      //   tooltip: 'Pie Chart',
      //   name: 'chart_btn',
      //   classname: 'chartbutton',
      // },
    ] : [
      {
        label: 'Preview',
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist:
          this.login_user_details.userinfo.user_type === 'is_rep'
            ? ['campaign_name', 'product_name', 'click_count']
            : ['name', 'email', 'clickCount'],
      },
      // {
      //   label: 'Chart',
      //   type: 'listner',
      //   id: 'chart_btn',
      //   tooltip: 'Pie Chart',
      //   name: 'chart_btn',
      //   classname: 'chartbutton',
      // },
      {
        label: 'details conversion report',
        type: 'listner',
        id: 'details_conversion_report_btn',
        tooltip: 'details conversion report',
        name: 'details_conversion_report_btn',
        classname: 'detailsbutton',
      },
    ],
  };
  ngOnInit() {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log('activatedRoute========>', response);
      if (response?.data?.status === 'success') {
        this.tabledatatalist = response?.results?.res ? response.results.res : [];
        console.log('tabledatatalist=====>', this.tabledatatalist);
      }
    });
    if (this.login_user_details.roleval === 3) {
      this.apiservice
        .getHttpDataPost('click-conversion/click-list-count', {
          condition: {
            limit: 10,
            skip: 0,
          },
          searchcondition: {
            user_id: this.login_user_details.userinfo._id,
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
            this.date_search_source_count = response.count; // role data count  save
          }
        });
    }
  }
  listenLiblistingChange(data: any) {}
  onLiblistingButtonChange(val: any) { }
}
