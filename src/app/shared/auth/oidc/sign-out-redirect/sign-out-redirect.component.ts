import { from as observableFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserManager} from 'oidc-client';
import {ROUTE_PATHS} from '../../../../app-routing/route-paths';

@Component({
  selector: 'app-sign-out-redirect',
  template: ''
})
export class SignOutRedirectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const redirect = new UserManager({}).signoutRedirectCallback();
    const redirectAsObservable = observableFrom(redirect);
    redirectAsObservable.subscribe(() => {
      // navigating to home should trigger login
      this.router.navigate([ROUTE_PATHS.LAYOUT]);
    });
  }

}
