import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css'],
})
export class UserAddEditComponent {
  update_id: any;
  forUpdate: any = false;
  public formValue: any = {};
  public tabledatatalist: any = [];
  public editFormData: any = null;
  public formfieldrefreshdata: any = null;
  public formfieldrefresh: any = null;
  public userformdata: any = {};
  statusarr: any = [
    { val: 1, name: 'Active' },
    { val: 0, name: 'Inactive' },
  ];
  public addFormLoader: boolean = false;
  public loader: boolean = false;
  public isedit: boolean = false;
  passwordregex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  emailregex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  zip_regex: RegExp = /^[0-9]{5}(?:-[0-9]{4})?$/;

  externaldatavalue: any;
  public paramsId: any = null;
  public stateList: any = [];
  public roleList: any = [];

  constructor(
    private apiService: ApiservicesService,
    public matSnackBar: MatSnackBar,
    public router: Router,
    public activateRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.paramsId = this.activateRoute.snapshot.params['id'];

    console.log(this.activateRoute.snapshot.params['id']);

    // console.log("hfhfhfhfh",this.initial_page);

    if (this.paramsId) {
      console.log(this.activateRoute);

      this.isedit = true;
      this.activateRoute.data.subscribe((response: any) => {
        console.log(' jewl data edit', response);
        if (response.data && response.data.status == 'success') {
          this.editFormData = response.data.results[0];
          this.update_id = response.data.results[0].uid;
          this.forUpdate = true;
        }
      });
    }
    this.initailForm();
    this.getStates();
  }

  getStates() {
    this.apiService
      .getHttpData('user-api/fetch-states')
      .subscribe((response: any) => {
        console.log(response);

        if (response.results && response.results.length > 0) {
          response.results.forEach((e: any, i: number) => {
            let obj = { val: e.abbreviation, name: e.name };
            this.stateList.push(obj);
          });
        }
        console.log(this.stateList, 'stateList');
      });
  }

  initailForm() {
    this.userformdata = {
      // from start
      successmessage: 'Added Successfully !!', // success message
      submittext: this.editFormData ? 'Update' : 'Submit',
      apiUrl: this.apiService.baseUrl,
      resettext: 'Reset',
      canceltext: 'Cancel',
      hidereset: this.editFormData ? true : false,
      jwttoken: '',
      fields: [
        {
          label: 'First Name',
          name: 'firstname',
          value:
            this.editFormData && this.editFormData.firstname
              ? this.editFormData.firstname
              : '',
          type: 'text',
          classname: 'aaa',
          validations: [
            { rule: 'required', message: 'First Name is Required' },
          ],
        },
        {
          label: 'Last Name',
          name: 'lastname',
          value:
            this.editFormData && this.editFormData.lastname
              ? this.editFormData.lastname
              : '',
          type: 'text',
          validations: [{ rule: 'required', message: 'Last Name is Required' }],
        },
        {
          label: 'Email',
          name: 'email',
          value:
            this.editFormData && this.editFormData.email
              ? this.editFormData.email
              : '',
          type: 'email',
          disabled: this.forUpdate,
          validations: [
            { rule: 'required', message: 'Email is Required' },
            {
              rule: 'pattern',
              value: this.emailregex,
              message: 'Must be a valid Email',
            },
          ],
        },
        {
          label: 'Phone',
          name: 'phone',
          value:
            this.editFormData && this.editFormData.phone
              ? this.editFormData.phone
              : '',
          type: 'numberformat',
          formatflag: true,
          validations: [
            { rule: 'required', message: 'Phone is Required' },
            {
              rule: 'minLength',
              value: 14,
              message: 'Formating Phone Number min 10',
            },
          ],
        },
        {
          label: 'Address',
          name: 'address',
          value:
            this.editFormData && this.editFormData.address
              ? this.editFormData.address
              : '',
          type: 'text',
          classname: 'address_field',
          validations: [{ rule: 'required', message: 'Address is Required' }],
        },
        {
          label: 'State',
          name: 'state',
          type: 'select',
          val: this.stateList,
          // value:[2021,2022],
          multiple: false,
          value:
            this.editFormData && this.editFormData.state
              ? this.editFormData.state
              : '',
          validations: [{ rule: 'required', message: 'State is Required' }],
        },
        {
          label: 'City',
          name: 'city',
          value:
            this.editFormData && this.editFormData.city
              ? this.editFormData.city
              : '',
          type: 'text',
          validations: [{ rule: 'required', message: 'City is Required' }],
        },
        {
          label: 'Zip',
          name: 'zip',
          value:
            this.editFormData && this.editFormData.zip
              ? this.editFormData.zip
              : '',
          type: 'number',
          validations: [
            { rule: 'required', message: 'Zip is Required' },
            {
              rule: 'pattern',
              value: this.zip_regex,
              message: 'Must be a valid zip code',
            },
          ],
        },
        !this.forUpdate && {
          label: 'Password',
          name: 'password',
          type: 'password',
          passwordflag: true,
          value:
            this.editFormData && this.editFormData.password
              ? this.editFormData.password
              : '',
          validations: [
            { rule: 'required', message: 'Password is required' },
            {
              rule: 'pattern',
              value: this.passwordregex,
              message: 'Must contain a Capital Letter and a Number',
            },
          ],
        },
        !this.forUpdate && {
          label: 'Confirm Password',
          name: 'confirmpassword',
          type: 'password',
          passwordflag: true,
          value:
            this.editFormData && this.editFormData.c_password
              ? this.editFormData.c_password
              : '',
          validations: [
            { rule: 'required', message: 'Confirm Password is required' },
            { rule: 'match', message: "Confirm Password doesn't match" },
            {
              rule: 'pattern',
              value: this.passwordregex,
              message: 'Must contain a Capital Letter and a Number',
            },
          ],
          customheadingflag: true,
        },
        {
          label: 'Active',
          name: 'status',
          type: 'checkbox',
          val: this.statusarr,
          value:
            this.editFormData && this.editFormData.status
              ? this.editFormData.status
              : 0,
        },
      ],
    };
  }

  listenFormFieldChange(val: any) {
    this.formValue = val.source?.data;

    console.log('listenFormFieldChangeval', val);

    if (val.field == 'fromsubmit' && val.fieldval == 'success') {
      this.addFormLoader = true;
      if (this.update_id) this.formValue['uid'] = this.update_id;
      this.apiService
        .getHttpDataPost(
          this.update_id ? 'user-api/user-edit' : 'user/user-add',
          this.formValue
        )
        .subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.status === 'success') {
              if (this.forUpdate) {
                this.matSnackBar.open('Updated Successfully', 'Ok', {
                  duration: 3000,
                });
              } else {
                this.matSnackBar.open('User Added Successfully', 'Ok', {
                  duration: 3000,
                });
              }

              setTimeout(() => {
                this.router.navigateByUrl(`affiliate-dashboard/user`);
              }, 2000);

              this.addFormLoader = false;
            } else {
              this.matSnackBar.open('Something Went Wrong!!', '', {
                duration: 3000,
              });

              this.addFormLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);

            this.matSnackBar.open(error.message, '', {
              duration: 3000,
            });
            this.addFormLoader = false;
          },
        });
    }

    if (val.field && val.field == 'formreset') {
      this.formfieldrefreshdata = {
        field: 'description',
        value: '',
      };
    }

    if (val.field && val.field == 'formcancel') {
      this.router.navigateByUrl(`affiliate-dashboard/user`);
    }
  }
}
