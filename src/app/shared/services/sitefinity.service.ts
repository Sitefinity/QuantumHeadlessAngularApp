import {Inject, Injectable} from '@angular/core';
import {SettingsService} from './settings.service';

const endpoint = '/api/default/';

@Injectable({
  providedIn: 'root'
})
export class SitefinityService {
  private sitefinity: any;
  private queryInstance: any;
  //defines whether everyone or just authenticated users can access the webservices
  private _hasAuthentication: boolean = false;

  get instance(): any {
    if(!this.sitefinity) {
      this.initializeInstance();
    }
    return this.sitefinity;
  }

  get query(): any {
    return this.queryInstance;
  }

  get hasAuthentication(): boolean {
    return this._hasAuthentication;
  }

  constructor(@Inject('Sitefinity') private sf, private settings: SettingsService) {}

  private initializeInstance(){
    const serviceUrl = `${this.settings.url}${endpoint}`;
    if(serviceUrl) {
      this.sitefinity = new this.sf({serviceUrl});
      this.queryInstance = new this.sf.Query();
    }
  }
}
