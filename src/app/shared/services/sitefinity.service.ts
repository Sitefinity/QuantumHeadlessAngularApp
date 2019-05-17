import { Inject, Injectable } from "@angular/core";
import { SettingsService } from "./settings.service";

export const endpoint = "/api/default/";

@Injectable({
  providedIn: "root"
})
export class SitefinityService {
  private sitefinity: any;
  private queryInstance: any;

  get instance(): any {
    if (!this.sitefinity) {
      this.initializeInstance();
    }
    return this.sitefinity;
  }

  get query(): any {
    return this.queryInstance;
  }

  set token(value: any) {
    this.instance.authentication.setToken(value);
  }

  get token() {
    return this.instance.authentication.getToken();
  }

  constructor(@Inject("Sitefinity") private sf, private settings: SettingsService) {}

  private initializeInstance() {
    const serviceUrl = `${this.settings.url}${endpoint}`;
    if (serviceUrl) {
      this.sitefinity = new this.sf({serviceUrl});
      this.queryInstance = new this.sf.Query();
    }
  }
}
