import {Inject, Injectable} from '@angular/core';

const sitefinityUrl = 'http://site17863115111365.srv05.sandbox.sitefinity.com';
const serviceUrl = sitefinityUrl + '/api/default/';

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

  constructor(@Inject('Sitefinity') private sf) {}

  private initializeInstance(){
    this.sitefinity = new this.sf({serviceUrl});
    this.queryInstance = new this.sf.Query();
  }
}
