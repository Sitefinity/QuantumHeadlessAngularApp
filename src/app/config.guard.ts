import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {SettingsService} from './shared/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivate {

  constructor(private router: Router, private settings: SettingsService) { }

  canActivate() {
    if (this.settings.url) {
      return true;
    } else {
      this.router.navigate(["/config"]);
      return false;
    }
  }
}
