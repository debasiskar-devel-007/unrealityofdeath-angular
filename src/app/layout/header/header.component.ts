import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public router: Router, public activateRoute: ActivatedRoute, private cookieService: CookieService, public matSnackBar: MatSnackBar, private apiservice: ApiservicesService) {
    window.scroll(0, 0);
  }

  public classToggled:boolean = false


  public toggleNav() {
    console.log('aaaa');
    this.classToggled = !this.classToggled;
  }

  navigateToPath(path: string) {
    console.log("path==========>", path)
    this.router.navigateByUrl(path)
  }
  currentPath(): string {
    return this.router.url
    
  }

}
