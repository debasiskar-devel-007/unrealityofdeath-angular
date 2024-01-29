import { Component } from '@angular/core';

@Component({
  selector: 'app-frontend-header',
  templateUrl: './frontend-header.component.html',
  styleUrls: ['./frontend-header.component.css']
})
export class FrontendHeaderComponent {
  navbarOpen = false;
   //Menu Openclose Function
   toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
