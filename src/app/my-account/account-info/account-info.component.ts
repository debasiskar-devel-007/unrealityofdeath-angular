import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent {

  public configFormData: any = null
  public formfieldrefresh: any = null;
  public formfieldrefreshdata: any = null;
  public dropdownvalue: any = [];
  public dropdownsouce: any = [];
  public formLoader: boolean = false;
  public paramsId: any = "";
  formValue: any = {}
  lodedValue: any = {}
  public forUpdate: boolean = false
  public editFormData: any = null;
  public update_id:any
  public userformdata: any = {};
  statusarr: any = [{ val: 1, name: 'Active' }, { val: 0, name: 'Inactive' }];
  public addFormLoader: boolean = false;
  public loader: boolean = false;
  public isedit: boolean = false;
  passwordregex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  emailregex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  externaldatavalue: any;
 
  public stateList: any = [];
  public roleList: any = [];
  public cookieData: any = {};
  constructor(private apiService: ApiservicesService, public cookieService: CookieService, public matSnackBar: MatSnackBar, public router: Router, public activateRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {

    this.cookieData = this.cookieService.get('login_user_details')
      ? JSON.parse(this.cookieService.get('login_user_details'))
      : {};      

    this.getStates()

    this.paramsId = this.cookieData.uidval
    console.log("paramsId", this.paramsId)
      this.activateRoute.data.subscribe((response: any) => {
        console.log("edit data", response)
        if (response) {
          console.log("response====>", response);

          if (response.data && response.data.status == "success") {
            this.isedit = true;
            console.log("this.isedit====>", this.isedit);
            this.editFormData = response.data.results;
          }
        }
      });

    console.log("editFormData====>", this.editFormData);
    this.initailForm();
    console.log("my account cookie",this.cookieData);
    
  }

  getStates() {
    this.apiService.getHttpData('user-api/fetch-states').subscribe((response) => {
      console.log(response);
      
      if (response.results && response.results.length > 0) {
        response.results.forEach((e: any, i: number) => {
          let obj = { val: e.name, name: e.name };
          this.stateList.push(obj)
        })
      }
      console.log(this.stateList, "stateList")
    })
  }



  initailForm() {

    console.log("my account form data", this.editFormData);

    this.userformdata =
    {
      // from start
      successmessage: 'Added Successfully !!', // success message
      submittext: this.editFormData ? 'Update' : 'Submit',
      apiUrl: this.apiService.baseUrl,
      // endpoint: 'users/addUpdateData',
      resettext: 'Reset',
      canceltext: 'Cancel',
      hidereset: this.editFormData ? true : false,
      jwttoken: '',
      // cancelroute: `admin/taxonomies/list`, // use for redirect after cancel the form
      fields: [

        {
          label: 'First Name',
          name: 'firstname',
          value: this.editFormData && this.editFormData[0].firstname ? this.editFormData[0].firstname : '',
          type: 'text',
          classname: 'aaa',
          validations: [
            { rule: 'required', message: 'First Name is Required' },

          ],
        },
        {
          label: 'Last Name',
          name: 'lastname',
          value: this.editFormData && this.editFormData[0].lastname ? this.editFormData[0].lastname : '',
          type: 'text',
          validations: [
            { rule: 'required', message: 'Last Name is Required' },

          ],
        },
        {
          label: 'Email',
          name: 'email',
          value: this.editFormData && this.editFormData[0].email ? this.editFormData[0].email : '',
          type: 'email',
          disabled: true,
          validations: [
            { rule: 'required', message: 'Email is Required' },
            // { rule: 'pattern', value: this.emailregex, message: "Must be a valid Email" }

          ],
        },
        
        {
          label: 'Phone',
          name: 'phone',
          value: this.editFormData && this.editFormData[0].phone ? this.editFormData[0].phone : '',
          type: 'numberformat',
          formatflag: true,
          validations: [
            { rule: 'required', message: 'Phone is Required' },
            { rule: 'minLength', value: 14, message: "Formating Phone Number min 10" },

          ],
        }, 



        {
          label: "State",
          name: "state",
          // hint: ',0000',
          type: 'select',
          val: this.stateList,
          // value:[2021,2022],
          multiple: false,
          //value: '',
          value: this.editFormData && this.editFormData[0].state ? this.editFormData[0].state : '',
          validations: [
            { rule: 'required', message: 'State is Required' }
          ],
          // prefix: "http://google.com/",
          // suffix: "PM"
        },
        {
          label: 'City',
          name: 'city',
          value: this.editFormData && this.editFormData[0].city ? this.editFormData[0].city : '',
          type: 'text',
          validations: [
            { rule: 'required', message: 'city is Required' },

          ],
        },
        {
          label: 'Zip',
          name: 'zip',
          value: this.editFormData && this.editFormData[0].zip ? this.editFormData[0].zip : '',
          type: 'number',
          validations: [
            { rule: 'required', message: 'zip is Required' },

          ],
        },
        {
          label: 'Address',
          name: 'address',
          value: this.editFormData && this.editFormData[0].address ? this.editFormData[0].address : '',
          type: 'text',
          classname:'address_field',

          validations: [
            { rule: 'required', message: 'Address is Required' },

          ],
        },
    
    
        
        // {
        //   label: "Gender",
        //   name: "gender",
        //   type: 'select',
        //   value: this.editFormData && this.editFormData[0].gender ? this.editFormData[0].gender : '',
        //   val: [
        //     { val: 'Male', name: 'Male' },
        //     { val: 'Female', name: 'Female' },
        //     { val: 'Others', name: 'Others' },
        //   ],
        //   multiple: false,
        //   validations: [
        //     { rule: 'required', message: 'Gender is Required' }
        //   ],

        // },

      ]
    }

  

  }


  listenFormFieldChange(val: any) {
    console.log("buttion clicked", val);
    this.editFormData = val.source?.data

    
    if (val.field === "fromsubmit" && val.fieldval === "success") {
      let dataobj = val.fromval;
      
        this.addFormLoader = true
        let value = { "uid": this.paramsId, "status": 1, ...this.editFormData }
        console.log("aaa====>>>", value);
        if (value.email) value.email = value.email.toLowerCase()
        this.apiService.getHttpDataPost("user-api/user-edit", value).subscribe({
          next: (response: any) => {
            console.log(response);
            
            if(response.status === "success"){
              this.matSnackBar.open(response.message, "ok", {
                duration: 3000
              })
              this.addFormLoader = false;

          

               this.router.navigateByUrl(`/affiliate-dashboard`);

              let newcookie = {
                
                ...this.cookieData, username:`${response.results[0].firstname.trim()} ${response.results[0].lastname.trim()}`
              }
              console.log("this.cookieData", newcookie);
              
              this.cookieService.set('login_user_details', JSON.stringify(newcookie)); 
              console.log("newcookie", newcookie);                      
              this.loader = false
              console.log("this.loader", this.loader);
              this.matSnackBar.open(response.message, "Ok", {
                duration: 3000
              });
              // this.router.navigateByUrl(`admin-dashboard`);
              // this.addFormLoader = false;
              this.location.back();

            }
            
           
             
          },
          error: (error: any) => {
            console.log('error --------->', error);
            this.addFormLoader = false
            this.matSnackBar.open("Something Went wrong!", '', { duration: 1000 });
          }
      
        })



      


    }

    if (val.field && val.field === "formcancel") {
      this.router.navigateByUrl(`/affiliate-dashboard`);
    }

    if (val.field && val.field === "formreset") {
      this.formfieldrefreshdata = {
        value: '',
      }
    }

  }

}
