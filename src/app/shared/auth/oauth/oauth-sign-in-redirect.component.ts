import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OauthProvider, OAuthToken } from "./oauth.provider";

@Component({
    selector: "sf-oauth-sign-in-redirect",
    template: ""
})
export class OauthSignInRedirectComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit(): void {
        const fragment = this.router.url.split("#")[1];
        const params = fragment.split("&");
        const parsedParams = {};
        params.forEach(param => {
            parsedParams[param.split("=")[0]] = param.split("=")[1];
        });

        const t = parsedParams["access_token"];
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + parsedParams["expires_in"] * 1000);
        const returnUrl = decodeURIComponent(decodeURIComponent(parsedParams["state"]));

        const token = new OAuthToken();
        token.value = t;
        token.expirationTime = expires;
        token.type = parsedParams["token_type"];
        OauthProvider.setToken(token);

        this.router.navigateByUrl(returnUrl);
    }
}
