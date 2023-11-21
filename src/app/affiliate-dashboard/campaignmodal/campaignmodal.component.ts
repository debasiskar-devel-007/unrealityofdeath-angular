import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-campaignmodal',
  templateUrl: './campaignmodal.component.html',
  styleUrls: ['./campaignmodal.component.css']
})
export class CampaignmodalComponent {

  public tabledatatalist: any = [];

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<CampaignmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) {
    console.log(data);
    this.tabledatatalist = data
    
  }


  public formLoader: boolean = false
  public progressLoader: boolean = false;
  public datasource: any;
  tabledata_header_skip: any = ["_id"];
  tabledata_detail_skip: any = ['_id', 'usertype'];
 
  updatetable: boolean = false;
  tablename = "package";
  editroute = "";
  updateendpoint = "reps/campaign-status-change";
  deleteendpoint = "reps/campaign-delete";
  datacollection: any = "reps/campaign-list";
  public listprogressBar: any = false;
  public api_url_for_managebanner = environment.api_url
  public cookieData = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}
  searchendpoint = "reps/campaign-list";
  date_search_endpoint: any = "reps/campaign-list";
  date_search_source: any = "package";
  date_search_source_count: any = 0;
  Tabledata_header_skip: any = ["_id"];
  limitcond: any = {
    limit: 10,
    skip: 0,
    pagecount: 1,
  };
  statusarray: any = [
    { val: 1, name: "Active" },
    { val: 0, name: "Inactive" },
  ];
  rolearray: any = []
  modify_header_array: any = {
    campaign_name: "Campaign Name",
    // lastname: "Last Name",
    landing_page_name: "Landing Page",
    status: "Status",
    created_on: "Created on",
  };


  search_settings: any = {}
  sortdata: any = {
    type: "desc",
    field: "created_on",
    options: ["campaign_name", "landing_page_name", "status", "created_on",],
  };
  public userName: any = {};
  public lastLogin: any = {};
  public isAdminUser: boolean = false;
  public isDoctorUser: boolean = false;

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
  }
  libdata: any = {
    basecondition: {

    },

    detailview_override: [
      // { key: "campaign_name", val: "Campaign Name" },
      // { key: "landing_page_name", val: "Landing Page" },
      // { key: "description", val: "Description" },
      // { key: "lastname", val: "lastname" },



    ],
    updateendpoint: "reps/campaign-status-change",

    hidedeletebutton: true,
    hideviewbutton: true,
    hideeditbutton: true,
    hidestatustogglebutton: false,
    hidemultipleselectbutton: true,
    hideaction: false,
    updateendpointmany: "reps/campaign-status-change",

    deleteendpointmany: "reps/campaign-delete",
    tableheaders: ["campaign_name", "landing_page_name", "created_on", "status"],

    colpipes: [
      { type: 'datetime', col: 'created_on', format: 'MMMM D YYYY, h:mm A' },
    ],


    custombuttons: [

      {
        label: "Edit",
        type: 'listner',
        id: 'edit_btn',
        tooltip: 'Edit',
        name: 'edit',
        cond: 'default',
        condval: '0',
        classname: 'edit_btn'
      },
      {
        label: "Preview",
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist: ["campaign_name", "product_name", "description", "created_on", "status"]
      },
      {
        label: "Delete",
        type: 'listner',
        id: 'delete_btn',
        tooltip: 'Delete',
        cond: 'default',
        condval: '0',
        name: 'delete',
        classname: 'delete_btn'
      },
      {
        label: "Copy",
        type: 'listner',
        id: 'copy_btn',
        tooltip: 'Copy',
        name: 'copy',
        classname: 'copy_btn'
      },

    ],


  }
  public taxonomy_updatetable: boolean = false;
  public jwttokenformanagebanner = ''


  ngOnInit() {
    this.formLoader = true
    const login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}

    //  this.userListFetching()
    // Subscribe to list data fetching



  }



  fetchlist() { }

  onLiblistingButtonChange(val: any) {

  }
  listenLiblistingChange(data: any = null) {
    console.log("test", data);
  
    

  }


  editListItem(item: any) {
    if (item) {
      console.log("Op=====>1", item);
      //this.router.navigateByUrl(`/rep-dashboard/${item._id}`);
    }
  }



}
