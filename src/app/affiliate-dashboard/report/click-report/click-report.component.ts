import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { PreviewComponent } from 'src/app/Common-components/preview/preview.component';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-click-report',
  templateUrl: './click-report.component.html',
  styleUrls: ['./click-report.component.css']
})
export class ClickReportComponent {
  public tabledatatalist: any = [];
  public thisbutonclick: string = 'month';
  public startval: any = moment().startOf('month').valueOf();
  public endval: any = moment().endOf('month').valueOf();
  public listprogressBar: any = false;
  public login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')): {};
  public jwttokenformanagebanner = '';
  public api_url_for_managebanner = environment.api_url;
  tabledata_detail_skip: any = ['_id'];
  public formLoader: boolean = false
  public taxonomy_updatetable: boolean = false;
  date_search_source_count: any = 10;
  date_search_endpoint: any = 'click-conversion/click-list';
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
    click_count: 'Click Count',
  }
  tablename = 'report_convertion';

  sortdata: any = {
    type: 'desc',
    field: 'campaign_name',
    options: this.login_user_details.roleval === 3 ? ['campaign_name', 'landing_page_name'] : [],
  };

  constructor(
    public router: Router,
    public cookieService: CookieService,
    public activatedRoute: ActivatedRoute,
    private apiservice: ApiservicesService,
    public dialog: MatDialog
  ) { }

  public dateValFlag: boolean = false

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
            field: 'created_on',
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
  searchendpoint =  this.login_user_details.roleval === 3 ? 'click-conversion/click-list' : '';

  libdata: any = {
    basecondition:
      this.login_user_details.roleval === 3
        ? {
          affiliate_id: this.login_user_details.uidval,
          // created_on: {}
        }
        : {
          affiliate_id: this.login_user_details.uidval,
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
        ? ['campaign_name', 'landing_page_name', 'click_count']
        : [],
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
        this.buttonClick('', 'month')
        this.dateValFlag = true
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
            "field": "campaign_name"
        },
        "project": {},
        "token": ""
        })
        .subscribe((response: any) => {
          if (response) {
            this.date_search_source_count = response.count; // role data count  save
          }
        });
    }
  }

  listenLiblistingChange(data: any) {
    console.log("aaaaaa=====>",data);
    
    if (data.action === "custombuttonclick" && data.custombuttonclick.btninfo.id === "preview_btn" && data.custombuttonclick.data) {
      this.dialog.open(PreviewComponent, {
        panelClass: 'custom-modalbox',
        data: {
          key: data.custombuttonclick.btninfo.previewlist
          , value: data.custombuttonclick.data
        }

      });
    }


  }
  onLiblistingButtonChange(val: any) { }

  buttonClick(val: any, butonval: any) {
    this.thisbutonclick = butonval
    this.dateValFlag = false;
    if (butonval === "all") {
      this.formLoader = true
      console.log("startOf current moment's month:", this.startval, this.endval)
      this.startval = 0
      this.endval = 0

      if (this.login_user_details.roleval === 3) {

        this.search_settings.datesearch[0].value = {}
        this.search_settings.datesearch[0].value = { "$gte": this.startval, "$lte": this.endval }

        setTimeout(() => {
          this.dateValFlag = true;
          this.formLoader = false;

        }, 100);

      }
    }
    if (butonval === "month") {
      this.formLoader = true

      this.startval = moment().startOf('month').valueOf()
      this.endval = moment().endOf('month').valueOf()
      console.log("startOf current moment's month:", this.startval, this.endval)


      if (this.login_user_details.roleval === 3) {

        this.search_settings.datesearch[0].value = {}
        this.search_settings.datesearch[0].value = { "$gte": this.startval, "$lte": this.endval }

        setTimeout(() => {
          this.dateValFlag = true;
          this.formLoader = false;

        }, 100);

      }
    }

    if (butonval === "week") {
      this.formLoader = true

      this.startval = moment().startOf('week').valueOf()
      this.endval = moment().endOf('week').valueOf()
      console.log("startOf current moment's week:", this.startval, this.endval)

      if (this.login_user_details.roleval === 3) {

        this.search_settings.datesearch[0].value = {}
        this.search_settings.datesearch[0].value = { "$gte": this.startval, "$lte": this.endval }

        setTimeout(() => {
          this.dateValFlag = true;
          this.formLoader = false;

        }, 100);
      }
    }
    if (butonval === "today") {
      this.formLoader = true

      this.startval = moment().startOf('day').valueOf()
      this.endval = moment().endOf('day').valueOf()
      console.log("startOf current moment's week:", this.startval, this.endval)

      if (this.login_user_details.roleval === 3) {

        this.search_settings.datesearch[0].value = {}
        this.search_settings.datesearch[0].value = { "$gte": this.startval, "$lte": this.endval }

        setTimeout(() => {
          this.dateValFlag = true;
          this.formLoader = false;

        }, 100);

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
          "field": "campaign_name"
        },
        "token": "",
        "project": {}
      }
      this.apiservice.getHttpDataPost('click-conversion/click-list', dataobj).subscribe((response) => {
        console.log("response login info", response);
        if (response.status === "success") {
          this.formLoader = false
          this.listprogressBar = true
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
          "created_on": (this.startval && this.endval && this.startval > 0 && this.endval > 0) ? { "$gte": this.startval, "$lte": this.endval }  : {},
        },
        "sort": {
          "type": "desc",
          "field": "campaign_name"
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
