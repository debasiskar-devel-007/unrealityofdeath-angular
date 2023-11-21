import { Component, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-campaignmodal',
  templateUrl: './campaignmodal.component.html',
  styleUrls: ['./campaignmodal.component.css']
})
export class CampaignmodalComponent {

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<CampaignmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) {
    console.log(data);
    
  }

}
