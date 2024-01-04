import { Component, ElementRef, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { DialogData } from 'listing-angular15';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-dashboard-report-modal',
  templateUrl: './dashboard-report-modal.component.html',
  styleUrls: ['./dashboard-report-modal.component.css']
})
export class DashboardReportModalComponent {
  public opportunity_data:any = null
  public colorcode: boolean = true
  public currentButtonVal: any = 'click'
  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<DashboardReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private clipBoard: Clipboard
  ) {
    console.log(data);
    this.opportunity_data = data.opportunity_data;

    
  }

  public reportCounts:any = {click:0, convert:0}

  public pieData: any = null

  ngOnInit(){

    // console.log("data.opportunity_data=======>",this.data.opportunity_data);
    this.opportunity_data = this.data.opportunity_data;
    
    const requestBody:any = {
      "condition": {
        "limit": 5,
        "skip": 0
      },
      "searchcondition": this.data.opportunity_data,
      "sort": {
        "type": "desc",
        "field": "created_on"
      },
      "project": {},
      "token": ""
    }

    this.apiService.getHttpDataPost('click-conversion/dashboard-click-list-count',requestBody).subscribe({
      next:(response)=>{
        console.log('response===========>',response);
        this.reportCounts.click = response.clickcount
        this.reportCounts.convert = response.conversioncount

        this.pieData = response


        console.log("err======>",this.pieData);
      },
      error:(err)=>{
        console.log("err======>",err);
        
      }
    })
  }

  fetchReports(val:string){
    console.log("val==========>",val);
    
    if(this.currentButtonVal != val && this.data.opportunity_data){
      if(val == 'click'){
        this.currentButtonVal = val
        this.colorcode = true
      }else if(val == 'conversion' && this.data.opportunity_data){
        this.currentButtonVal = val
        this.colorcode = false
      }
    }
  }


}
