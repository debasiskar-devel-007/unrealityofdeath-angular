import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
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
  public thisbutonclick: string = 'month';
  public startval: any = moment().startOf('month').valueOf();
  public endval: any = moment().endOf('month').valueOf();

  public login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')): {};
  public jwttokenformanagebanner = '';
  public api_url_for_managebanner = environment.api_url;
  tabledata_detail_skip: any = ['_id'];

  public taxonomy_updatetable: boolean = false;
  date_search_source_count: any = 10;
  date_search_endpoint: any = 'intake/assaylist';
  date_search_source: any = 'users';
  datacollection: any = this.login_user_details.roleval === 3 ? 'click-conversion/click-list' : '';
    
  statusarray: any = [
    { val: 1, name: 'Active' },
    { val: 0, name: 'Inactive' },
  ];
  limitcond: any = {
    limit: 10,
    skip: 0,
    pagecount: 1,
  };

  public modify_header_array: any =  {
    campaign_name: 'Campaign Name',
    landing_page_name: 'Landing Page Name',
    conversion_count: ' Conversion Count',
  }
  tablename = 'report_convertion';

  sortdata: any = {
    type: 'desc',
    field: 'created_on',
    options: this.login_user_details.roleval === 3 ? ['campaign_name', 'landing_page_name'] : [],
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
          affiliate_id: this.login_user_details.uidval,
          created_on: { $gte: this.startval, $lte: this.endval },
        }
        : {
          created_on: { $gte: this.startval, $lte: this.endval },
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
        ? ['campaign_name', 'landing_page_name', 'conversion_count']
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
          this.login_user_details.roleval === 3
            ? ['campaign_name', 'landing_page_name', 'click_count']
            : [],
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
      // {
      //   label: 'Preview',
      //   type: 'listner',
      //   id: 'preview_btn',
      //   tooltip: 'Preview',
      //   name: 'preview_btn',
      //   classname: 'previewButton',
      //   previewlist:
      //      this.login_user_details.roleval === 3
      //       ? ['campaign_name', 'product_name', 'click_count']
      //       : ['name', 'email', 'clickCount'],
      // },
      // {
      //   label: 'Chart',
      //   type: 'listner',
      //   id: 'chart_btn',
      //   tooltip: 'Pie Chart',
      //   name: 'chart_btn',
      //   classname: 'chartbutton',
      // },
      // {
      //   label: 'details conversion report',
      //   type: 'listner',
      //   id: 'details_conversion_report_btn',
      //   tooltip: 'details conversion report',
      //   name: 'details_conversion_report_btn',
      //   classname: 'detailsbutton',
      // },
    ],
  };
  ngOnInit() {
    this.activatedRoute.data.subscribe((response: any) => {
      console.log('activatedRoute========>', response);
      if (response?.data?.status === 'success') {
        this.tabledatatalist = response?.data?.results?.res ? response.data.results.res : [];
        console.log('tabledatatalist=====>', this.tabledatatalist);
      }
    });
    if (this.login_user_details.roleval === 3) {
      this.apiservice
        .getHttpDataPost('click-conversion/click-list-count', {
          "condition": {
            "limit": 10,
            "skip": 0
        },
        "searchcondition": {
            "affiliate_id": this.login_user_details.uidval,
            
        },
        "sort": {
            "type": "desc",
            "field": "created_on"
        },
        "project": {},
        "token": ""
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

  buttonClick(val: any, butonval: any) {
    this.thisbutonclick = butonval
    if (butonval === "all") {
      // this.formLoader = true
      console.log("startOf current moment's month:", this.startval, this.endval)
      this.startval = 0
      this.endval = 0

      if (this.login_user_details.roleval === 3) {

        this.libdata.basecondition = { created_at: (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval } : {} }
        console.log("aaaaa", this.libdata.basecondition);

      }
    }
    if (butonval === "month") {
      // this.formLoader = true

      this.startval = moment().startOf('month').valueOf()
      this.endval = moment().endOf('month').valueOf()
      console.log("startOf current moment's month:", this.startval, this.endval)


      if (this.login_user_details.roleval === 3) {

        this.libdata.basecondition = { created_at: (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval } : {} }
        console.log("mmmm", this.libdata.basecondition);

      }
    }

    if (butonval === "week") {
      // this.formLoader = true

      this.startval = moment().startOf('week').valueOf()
      this.endval = moment().endOf('week').valueOf()
      console.log("startOf current moment's week:", this.startval, this.endval)

      if (this.login_user_details.roleval === 3) {

        this.libdata.basecondition = { created_at: (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval } : {} }
        console.log("aaaaa", this.libdata.basecondition);

      }
    }
    if (butonval === "today") {
      // this.formLoader = true

      this.startval = moment().startOf('day').valueOf()
      this.endval = moment().endOf('day').valueOf()
      console.log("startOf current moment's week:", this.startval, this.endval)

      if (this.login_user_details.roleval === 3) {

        this.libdata.basecondition = { created_at: (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval } : {} }
        console.log("aaaaa", this.libdata.basecondition);

      }
    }




    if (this.login_user_details.roleval === 3) {
      console.log("abcd", Object.keys(this.startval).length, Object.keys(this.endval).length, this.startval, this.endval);

      let dataobj = {
        "condition": {
          "limit": 10,
          "skip": 0
      },
        "searchcondition": {
         "affiliate_id": this.login_user_details.uidval,
          "created_on": (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval } : {},
        },
        "sort": {
          "type": "desc",
          "field": "created_on"
        },
        "token": "",
        "project": {}
      }
      this.apiservice.getHttpDataPost('click-conversion/click-list', dataobj).subscribe((response) => {
        console.log("response login info", response);
        if (response.status === "success") {
          // this.formLoader = false
          // this.listprogressBar = true
          this.tabledatatalist = []
          setTimeout(() => {
            this.tabledatatalist = response.results.res
            console.log("abcdef========>", this.tabledatatalist);
          }, 50);
        }

      })
      this.apiservice.getHttpDataPost(
        'click-conversion/click-list-count', {
        "condition": {
          "limit": 10,
          "skip": 0
        },
        "searchcondition": {
          "affiliate_id": this.login_user_details.uidval,
          "created_on": (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { created_on: { "$gte": this.startval, "$lte": this.endval } } : {},
        },
        "sort": {
          "type": "desc",
          "field": "created_on"
        },
        "project": {},
        "token": ""
      },
      ).subscribe((response: any) => {

        if (response && response.count) {
          this.date_search_source_count = response.count;  // role data count  save 
        }

      })
    }
  }
}
