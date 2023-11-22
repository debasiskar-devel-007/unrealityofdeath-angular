import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { SharedModule } from 'src/app/shared/shared.module';
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
    private elementRef: ElementRef,
    public dialog: MatDialog
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

  campainAdd() {

    const dialogRef = this.dialog.open(addCampainModal, {
      panelClass: 'custom-modalbox',
      data: {
        heading: 'Alert!!',
        setDefaultObj: {
          
        },
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        this.updatetable = !this.updatetable;
      }, 1000);
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

  constructor(private cookieService: CookieService, private apiservice: ApiservicesService, public matSnackBar: MatSnackBar, public activateRoute: ActivatedRoute, public router: Router, private dialogRef: MatDialogRef<addCampainModal>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("data========>+", data)
  }

  public configFormData = {}
  // public landingarrayvalue: any = []
  public formfieldrefresh: any = null;
  public formfieldrefreshdata: any = null;
  public dropdownvalue: any = [];
  public loader: boolean = false;
  public paramsId: any = "";
  formValue: any = {}
  lodedValue: any = {}
  public forUpdate: boolean = false
  update_id: any = ""
  public endpoint_resvalue: any = []

  ngOnInit() {
    if (this.data._id) {
      this.formValue = this.data
      this.forUpdate = true
    }
    this.addCampainForm()

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
          value: this.formValue && this.formValue.campaign_name ? this.formValue.campaign_name : '',
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
          value: this.formValue && this.formValue.description ? this.formValue.description : '',
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

      ]
    }

  }
  closePreview() {
    this.dialogRef.close()
    this.formValue = {}
  }
  listenFormFieldChange(val: any) {
    console.log("buttion clicked", val);
    this.formValue = val.source?.data
    if (this.forUpdate) {
      console.log("beforeloader", this.loader);

      let value = { "_id": this.data._id, ...this.formValue }
      console.log("aaa", value);
      if (val.field === "fromsubmit" && val.fieldval === "success") {
        this.loader = true
        const login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}
        this.apiservice.getHttpDataPost("reps/campaign-update", {
          user_id: login_user_details.userinfo._id,
          opportunity_id: this.data.opportunity_id,
          ...value
        }).subscribe({
          next: (response: any) => {
            console.log("edit response", response);
            console.log("response", response);
            console.log("afterloader", this.loader);
            this.loader = false;
            this.matSnackBar.open(response.message, "ok", {
              duration: 3000
            })
            setTimeout(() => {
              this.dialogRef.close()
            }, 4000)
          },
          error: (error: any) => {
            console.log('error --------->', error);
            this.loader = false
            this.matSnackBar.open("Something Went wrong!", '', { duration: 1000 });
          }

        })
      }




    } else if (!this.forUpdate) {
      console.log("beforeloader", this.loader);

      console.log("formValue", this.formValue);
      const login_user_details = this.cookieService.get('login_user_details') ? JSON.parse(this.cookieService.get('login_user_details')) : {}
      if (val.field === "fromsubmit" && val.fieldval === "success") {
        this.loader = true
        console.log("afterloader", this.loader);
        this.apiservice.getHttpDataPost("reps/campaign-add", {
          user_id: login_user_details.userinfo._id,
          opportunity_id: this.data.opportunity_id,
          ...this.formValue
        }).subscribe({
          next: (res: any) => {
            console.log("response", res);
            this.loader = false
            console.log("afterloader", this.loader);
            this.data = res
            this.matSnackBar.open('Campaign Created Successful', "Ok", {
              duration: 3000
            })
            setTimeout(() => {
              this.dialogRef.close()
            }, 4000)

          },
          error: (error: any) => {
            this.loader = false
            console.log('error --------->', error);
          }
        })

      }
    }


    if (val.field && val.field === "formcancel") {
      this.dialogRef.close()
    }
  }
}

// << -------------- Campain Add Modal ---------------- >>
