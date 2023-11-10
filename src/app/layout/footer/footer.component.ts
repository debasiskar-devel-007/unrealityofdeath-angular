import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  public currentYear:any = new Date().getFullYear()

  ngOnInit(){
    console.log("currentYear=============+>",this.currentYear);
    
  }

}
