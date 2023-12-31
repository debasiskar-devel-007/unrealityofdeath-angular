import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PreviewComponent } from 'src/app/Common-components/preview/preview.component';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  constructor(
    public router: Router,
    public cookieService: CookieService,
    public activatedRoute: ActivatedRoute,
    private apiservice: ApiservicesService,
    public dialog: MatDialog
  ) {}

  public cookieData: any = this.cookieService.get('login_user_details')
    ? JSON.parse(this.cookieService.get('login_user_details'))
    : {};

  public progressLoader: boolean = false;
  tabledata_detail_skip: any = [
    '_id',
    'username',
    'cognito_user_id',
    'user_type',
    'agent_code',
  ];
  tabledata_header_skip: any = ['_id'];
  public tabledatatalist: any = [];
  updatetable: boolean = false;
  tablename = 'user';
  editroute = 'affiliate-dashboard/user/user-edit';
  updateendpoint = 'user-api/user-edit';
  deleteendpoint = 'marketing/user-delete';
  datacollection: any = 'user-api/user-list-new';
  public listprogressBar: any = false;
  public api_url_for_managebanner = environment.api_url;
  searchendpoint = 'user-api/user-list-new';
  date_search_endpoint: any = 'user-api/user-list-new';
  date_search_source: any = 'users';
  date_search_source_count: any = 0;
  Tabledata_header_skip: any = ['_id'];
  jwttokenformanagebanner = '';
  public userName: any = {};
  public lastLogin: any = {};

  limitcond: any = {
    limit: 10,
    skip: 0,
    pagecount: 1,
  };

  statusarray: any = [
    { val: 1, name: 'Active' },
    { val: 0, name: 'Inactive' },
  ];

  modify_header_array: any = {
    fullname: 'Name',
    email: 'Email',
    phone: 'Phone No',
    status: 'Status',
    created_on: 'Joined On',
  };

  search_settings: any = {
    textsearch: [
      { label: 'Search By Name', field: 'fullname' },
      { label: 'Search By Email', field: 'email' },
      { label: 'Search By Phone No', field: 'phone' },
    ],

    selectsearch: [
      { label: 'Search By Status', field: 'status', values: this.statusarray },
    ],

    datesearch: [
      {
        startdatelabel: 'Search By Joined On Start Date',
        enddatelabel: 'Search By Joined On End Date',
        submit: 'Search',
        field: 'created_on',
      },
    ],
  };

  sortdata: any = {
    type: 'desc',
    field: 'created_on',
    options: ['fullname', 'email', 'phone', 'status', 'created_on'],
  };

  libdata: any = {
    basecondition: {},
    detailview_override: [
      { key: 'fullname', val: 'Name' },
      { key: 'email', val: 'Email' },
      { key: 'phone', val: 'Phone No' },
      { key: 'status', val: 'Status' },
      { key: 'created_on', val: 'Joined On' },
    ],
    updateendpoint: 'marketing/user-status-change',
    hideeditbutton: true,
    hidedeletebutton: false,
    hideviewbutton: true,
    hidestatustogglebutton: false,
    hidemultipleselectbutton: true,
    hideaction: false,
    updateendpointmany: 'marketing/user-status-change',
    deleteendpointmany: 'marketing/user-delete',
    tableheaders: ['fullname', 'email', 'phone', 'status', 'created_on'],
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
          'fullname',
          'email',
          'phone',
          'address',
          'state',
          'city',
          'zip',
          'status',
          'created_on',
        ],
      },
    ],
  };

  public taxonomy_updatetable: boolean = false;

  ngOnInit() {
    this.libdata.basecondition = {
      affiliate_id: this.cookieData?.uidval,
    };

    // role listing data
    this.activatedRoute.data.subscribe((response: any) => {
      if (response.data.status === 'success') {
        this.tabledatatalist = response.data.results.res
          ? response.data.results.res
          : [];

        // role data save
      }

      console.log('tabledatalist =====>>>', this.tabledatatalist);
    });
    // role list data count
    this.apiservice
      .getHttpDataPost('user-api/user-list-new-count', {
        condition: {
          limit: 10,
          skip: 0,
        },
        searchcondition: {
          affiliate_id: this.cookieData?.uidval,
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
          this.date_search_source_count = response.count; // count  save
        }
      });

    console.log('this is table list data', this.tabledatatalist);
  }

  // custom buttom click events funtion
  listenLiblistingChange(data: any = null) {
    console.log('onLiblistingButtonChange', data);
    console.log('this is table list data', this.tabledatatalist);

    if (
      data.action === 'custombuttonclick' &&
      data.custombuttonclick?.btninfo?.id === 'preview_btn' &&
      data.custombuttonclick.data
    ) {
      this.dialog.open(PreviewComponent, {
        panelClass: 'custom-modalbox',
        data: {
          key: data.custombuttonclick.btninfo.previewlist,
          value: data.custombuttonclick.data,
          flagParam: 'affiliate-dashboard/user',
        },
      });
    }

    // custom button click for Edit button

    if (
      data.action == 'custombuttonclick' &&
      data?.custombuttonclick?.btninfo?.id == 'edit_btn' &&
      data?.custombuttonclick?.data
    ) {
      this.router.navigateByUrl(
        `affiliate-dashboard/user/user-edit/${data.custombuttonclick.data.uid}`
      );
    }
  }

  onLiblistingButtonChange(data: any = null) {
    console.log('onLiblistingButtonChange', data);
  }
}
