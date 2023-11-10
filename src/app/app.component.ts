import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'unrealityofdeath-angular';
  constructor( public router: Router ) {}

  color: ThemePalette = 'accent';
  mode: ProgressBarMode = 'indeterminate';
  public loader: boolean = false;

  ngOnInit() {
    // Loader Config
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.loader = true;
          break;
        case event instanceof NavigationEnd:
          this.loader = false;
          break;
        case event instanceof NavigationError:
          this.loader = false;
          break;
      }
    });
  }



}
