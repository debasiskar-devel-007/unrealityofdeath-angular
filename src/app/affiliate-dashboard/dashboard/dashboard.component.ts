import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogData } from 'listing-angular15';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    public router: Router,
    public cookieService: CookieService,
    private apiService: ApiservicesService,
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    const dialogRef = this.dialog.open(UniqueUrlModal, {
      panelClass: 'custom-modalbox',
      data: {
        heading: 'Create Your Unique URL!!',
        setDefaultObj: {
          
        },
      },
    });
  }

}

@Component({
  selector: 'UniqueUrlModal',
  templateUrl: './uniqueurl-modal.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule],
})
export class UniqueUrlModal {

  public loader: boolean = false

  constructor(
    public apiService: ApiservicesService,
    public dialogRef: MatDialogRef<UniqueUrlModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public matSnackBar: MatSnackBar
  ) {
  }

  ngOnInit() {

  }

  public closeModal() {
    this.dialogRef.close();
  }
}