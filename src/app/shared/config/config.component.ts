import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {Router} from '@angular/router';
import {ROUTE_PATHS} from '../../app-routing/route-paths';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  constructor(private settings: SettingsService, private router: Router) { }

  ngOnInit() {
  }

  get currentUrl(): string {
    return this.settings.url;
  }

  set currentUrl(value: string) {
    this.settings.url = value;
  }

  onSave() {
    this.currentUrl = this.parseSitefinityUrlInput(this.currentUrl);
    this.redirectToHome();
  }

  redirectToHome() {
    this.router.navigate([ROUTE_PATHS.LAYOUT]);
  }

  private parseSitefinityUrlInput(str: string): string {
    // trim whitespaces
    str = str.trim();

    // strip end slashes
    while (str.endsWith('/')) {
      str = str.substring(0, str.length - 1);
    }

    // add protocol scheme (https://) if missing
    if (!str.match(/^\w+:\/\//)) {
      str = "http" + str;
    }

    return str;
  }
}
