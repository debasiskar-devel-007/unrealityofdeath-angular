import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent {

  public datakey: any;
  public datavalue: any;
  public value: any;
  public extractedData: any = {};
  public created_on: any;
  public updated_on: any
  public created_at :any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PreviewComponent>) {
    this.datakey = this.data.key
    this.datavalue = this.data.value
    console.log("dtatadtaa====",this.data)
  }

  public custom: any = [
    'name',
    'email'
  ]

  ngOnInit() {
    console.log("kkkkkkkkk===", this.datakey, this.datavalue);
    this.datafilter(this.datakey, this.datavalue)

  }


  datafilter(required_keys: any, dataset: any) {

    const keys = Object.keys(dataset)



    for (const key of this.datakey) {

      if (key === "created_on") {
        this.created_on = moment(dataset[key]).format('MMMM Do YYYY, h:mm:ss a')
      }
      if (key === "updated_on") {
        this.updated_on = moment(dataset[key]).format('MMMM Do YYYY, h:mm:ss a')
      }
      if (key === "created_at") {
        this.created_at = moment(dataset[key]).format('MMMM Do YYYY, h:mm:ss a')
      }




      console.log("this.datakey=====>", this.datakey);


    }





  }

  closePreview() {
    this.dialogRef.close()
  }

}
