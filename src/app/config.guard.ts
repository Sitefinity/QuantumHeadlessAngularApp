import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SettingsService} from './shared/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivate {

  constructor(private router: Router,  private settings: SettingsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const sandboxUrl = route.queryParams['url'];

    if (this.settings.url && !sandboxUrl) {
      return true;
    } else {
      this.router.navigate(["/config"], {queryParams: {'url': sandboxUrl}});
      return false;
    }
  }
}
