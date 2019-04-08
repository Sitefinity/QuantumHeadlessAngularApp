import { from as observableFrom } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserManager } from "oidc-client";

@Component({
  selector: "app-sign-in-redirect",
  template: ""
})
export class SignInRedirectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const redirect = new UserManager({}).signinRedirectCallback();
    const redirectAsObservable = observableFrom(redirect);
    redirectAsObservable.subscribe((args: SignInResponse) => {
      const state = args.state;
      this.router.navigateByUrl(state);
    });
  }

}

interface SignInResponse {
  state: string;
}
