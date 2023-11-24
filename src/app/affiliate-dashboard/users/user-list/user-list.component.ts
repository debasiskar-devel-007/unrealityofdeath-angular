import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  constructor(public router: Router, public cookieService: CookieService, public activatedRoute: ActivatedRoute, private apiservice: ApiservicesService, public dialog: MatDialog) { }

  
  public progressLoader: boolean = false;
  tabledata_detail_skip: any = ['_id','username','cognito_user_id','user_type','agent_code',];
  tabledata_header_skip: any = ["_id"];
  public tabledatatalist: any = [];
  updatetable: boolean = false;
  tablename = "package";
  editroute = 'admin-dashboard/user/edit-user';
  updateendpoint = 'user/user-status-change';
  deleteendpoint = 'user/user-delete';
  datacollection: any = 'user-api/user-list';
  public listprogressBar: any = false;
  public api_url_for_managebanner = environment.api_url
  searchendpoint = '';
  date_search_endpoint: any = '';
  date_search_source: any = 'users';
  date_search_source_count: any = 0;
  Tabledata_header_skip: any = ['_id'];
  jwttokenformanagebanner=""
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
    name: 'Name',
    email: 'Email',
    phone: 'Phone No',
    status: 'Status',
    created_at: 'Created On',
    user_type_str: 'User Type',
  }



  search_settings: any = {



    textsearch: [
      { label: "Search By Name", field: 'name' },
      { label: "Search By Email", field: 'email' },
      { label: "Search By Phone No", field: 'phone' }
    ],


    selectsearch: [
      { label: 'Search By Status', field: 'status', values: this.statusarray },
      { label: 'Search By User Type', field: 'user_type', values:[{ val: 'is_admin', name: 'Admin' }, { val: 'is_rep', name: 'Rep' }] },

    ],



    datesearch: [
      {
        startdatelabel: 'Search By Created On Start Date',
        enddatelabel: 'Search By Created On End Date',
        submit: 'Search',
        field: 'created_at',
      },
    ],
  }

  sortdata: any = {
    type: "desc",
    field: "created_at",
    options: ["name", "email", "phone","user_type_str","status", "created_at"],
  };


  public cookieData: any = {};


  libdata: any = {
    basecondition: {},
    detailview_override: [
      { key: "name", val: "name" },
      { key: "email", val: "Email" },
      { key: "phone", val: "Phone No" },
      { key: "status", val: "Status" },
      { key: "created_at", val: "Created On" },
    ],
    updateendpoint: "user/user-status-change",
    hideeditbutton: false,
    hidedeletebutton: false,
    hideviewbutton: true,
    hidestatustogglebutton: false,
    hidemultipleselectbutton: false,
    hideaction: false,
    updateendpointmany: "user/user-status-change",
    deleteendpointmany: "user/user-delete",
    tableheaders: ["name", "email", "phone","user_type_str","status", "created_at"],
    colpipes: [{ type: 'datetime', col: 'created_at', format: 'MMMM D YYYY, h:mm A' }],
    custombuttons: [
      {
        label: "Preview",
        type: 'listner',
        id: 'preview_btn',
        tooltip: 'Preview',
        name: 'preview_btn',
        classname: 'previewButton',
        previewlist:["name","email","phone","user_type_str","address","state","city","zip","status","created_at",]
      },

      {
        label: "Contract",
        type: 'listner',
        id: 'contract_btn',
        tooltip: 'Contract Preview',
        name: 'contract_btn',
        classname: 'contractButton',
        cond: 'has_betoparedes_access',
        condval: 1,
      },
      {
        label: "Leads",
        type: 'listner',
        id: 'leads_btn',
        tooltip: 'Leads',
        name: 'leads_btn',
        classname: 'leadsButton',
        cond: 'user_type',
        condval: 'is_rep'
      },
    ],
  }

  // searchendpoint = "package/package-list";

  public taxonomy_updatetable: boolean = false;

  ngOnInit() { 

    // role listing data 
    this.activatedRoute.data.subscribe((response: any) => {
      if (response.data.status === "success") {
         this.tabledatatalist = response.data.results.res.map((item:any)=>{
          return{...item,user_type_text: item.user_type === 'is_admin' ? 'Admin' : 'Rep',}
         })

         



          // role data save 
      }

      console.log("tabledatalist =====>>>", this.tabledatatalist)

    })
    // role list data count 
    this.apiservice.getHttpDataPost(
      'user/user-list-count', {
      "condition": {
        "limit": 10,
        "skip": 0
      },
      "searchcondition": {},
      "sort": {
        "type": "desc",
        "field": "createdon_datetime"
      },
      "project": {},
      "token": ""
    }
    ).subscribe((response: any) => {
      
      if (response && response.count) {
        this.date_search_source_count = response.count;  // role data count  save 
      }
    })


    console.log("this is table list data", this.tabledatatalist);


    if (this.cookieService.getAll()['login_user_details']) {
      this.cookieData = JSON.parse(this.cookieService.getAll()['login_user_details']);
      console.log("cookieData", this.cookieData.userinfo);
      this.userName = this.cookieData.userinfo.name
      this.lastLogin = this.cookieData.userinfo.last_login_time
    }




    if (this.cookieData) {
      console.log("cookieData====>", this.cookieData.userinfo);
      console.log("cookieDataaaaaaaa==>",this.libdata.notes)
      this.libdata.notes = {
        label: "Notes",
        tooltip: 'Add Notes',
        listendpoint: "notes/notes-list",
        deleteendpoint: 'notes/note-delete',
        extracond:{collection:'cognito_user_data'},
        addendpoint: "notes/notes-add",
        user: this.cookieData.userinfo._id,
        currentuserfullname: this.cookieData.userinfo.name,
        header: "name",
        
      }
      console.log("cookieDataaaaaaaa==>",this.libdata.notes)

    }

  }

  // custom buttom click events funtion 
  listenLiblistingChange(data: any = null) {
    console.log("onLiblistingButtonChange", data);
    console.log("this is table list data", this.tabledatatalist);

    // custom button click for Edit button  



  }








  onLiblistingButtonChange(data: any = null) {
    console.log("onLiblistingButtonChange", data);

  }

  addPackage() {
    this.router.navigateByUrl(`/admin-dashboard/user/add-user`);
  }

}
