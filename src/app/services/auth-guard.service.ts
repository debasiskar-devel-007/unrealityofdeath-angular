import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log("next================>", next, state, this.router)

    if (next.routeConfig?.path == 'affiliate-dashboard' && this.authService.isAffiliateAuthenticated()) return true
    if (next.routeConfig?.path == '') {
      const navigationRoute = this.authService.loggedInNavigation()
      console.log("navigationRoute==============>", navigationRoute)
      if (navigationRoute) this.router.navigateByUrl(navigationRoute);
      return true
    }
    
    this.router.navigateByUrl('/');
    return false;
  }
}