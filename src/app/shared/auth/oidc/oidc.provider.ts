import {ClassProvider, Inject, Injectable, InjectionToken} from '@angular/core';
import {AUTH_PROVIDER_TOKEN, AuthProvider, QuantumUser, Token} from '../auth.provider';
import { UserManager, User } from "oidc-client";
import { SettingsService } from "../../services/settings.service";
import { of as observableOf, from as observableFrom, combineLatest as observableCombineLatest, Observable, ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AUTH_ROUTE_PATHS } from "../../../app-routing/route-paths";
import { PathLocationStrategy } from "@angular/common";
import { UrlService } from '../../services/url.service';
import { WINDOW_TOKEN } from '../../common.constants';

const OPEN_ID_PATH = "Sitefinity/Authenticate/OpenID";

const OIDC_PROVIDER_NAME = "openid";

@Injectable()
export class OidcProvider implements AuthProvider {
  private token = new ReplaySubject<Token>(1);

  private manager: UserManager;
  private authSettingsUrl: string;
  private settings: any = {
    client_id: "sitefinity",
    response_type: "id_token token",
    scope: "openid profile",
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true
  };
  constructor(private settingsProv: SettingsService,
              private http: HttpClient,
              private router: Router,
              private locationStrategy: PathLocationStrategy,
              @Inject(WINDOW_TOKEN) private window: Window,
              private urlService: UrlService) {
  }

  init(): Observable<void> {
    this.initSettingsObj();
    return this.http.get(this.authSettingsUrl).pipe(map((authSettings: AuthSettings) => {
      this.settings.scope = authSettings.Scope;
      this.manager = new UserManager(this.settings);
      this.attachEvents();
    }));
  }

  attachEvents(): void {
    this.manager.getUser().then((user) => {
      if (user && !user.expired) {
        this.manager.storeUser(user);
        this.emitToken(user);
      }
    });
  }

  private emitToken(user: User): void {
    this.token.next({
      type: user.token_type,
      value: user.access_token
    });
  }

  getName(): string {
    return OIDC_PROVIDER_NAME;
  }

  getPriority(): number {
    return 3;
  }

  isAvailable(): Observable<boolean> {
    this.initSettingsObj();
    const url = this.settings.authority + "/.well-known/openid-configuration";
    return this.http.get(url, { observe: "response", responseType: "text" }).pipe(map(x => {
      const header = x.headers.get("content-type");
      if (header && header.startsWith("application/json")) {
        // This is done to avoid multiple request. This ways the oidc library doesn't
        // make the same request twice.
        this.settings.metadata = JSON.parse(x.body);
        return true;
      }

      return false;
    }));
  }

  private initSettingsObj(): any {
    if (!this.settings.authority && this.settingsProv.url) {
      this.settings.authority = `${this.settingsProv.url}/${OPEN_ID_PATH}`;
      this.settings.post_logout_redirect_uri = this.urlService.getAbsoluteUrl(`/auth/oidc/${AUTH_ROUTE_PATHS.SIGN_OUT_REDIRECT}`);
      this.settings.redirect_uri = this.urlService.getAbsoluteUrl(`/auth/oidc/${AUTH_ROUTE_PATHS.SIGN_IN_REDIRECT}`);
      this.settings.silent_redirect_uri = this.urlService.getAbsoluteUrl("/assets/auth/silent-renew.html");
      this.authSettingsUrl = `${this.settingsProv.systemServiceUrl}Default.AuthSettings(clientId='${this.settings.client_id}')`;
    }
  }

  signIn(returnUrl: string): Observable<void> {
    return observableFrom(this.manager.getUser()).pipe(switchMap((user) => {
      if (user && user.expired) {
        // if we have a user attempt to sign in the user silently without redirects
        return this.authenticateSilent(returnUrl);
      }

      return this.authenticateWithRedirects(returnUrl);
    }));
  }

  signOut(): Observable<void> {
    const signOut = this.manager.signoutRedirect();
    return observableFrom(signOut);
  }

  isLoggedIn(): Observable<boolean> {
    const user = observableFrom(this.manager.getUser());
    const session = observableFrom(this.manager.querySessionStatus());

    return observableCombineLatest(user, session).pipe(map(data => {
      const [user, session] = data;
      if (user && session) {
        if (!user.expired && user.profile.sub === session.sub) {
          return true;
        }
      }

      return false;
    }), catchError(() => {
      return observableOf(false);
    }));
  }

  getUser(): Observable<QuantumUser> {
    return observableFrom(this.manager.getUser()).pipe(map( user => { return { Username: user.profile.preferred_username, Picture: user.profile.picture}; } ));
  }

  getToken(): Observable<Token> {
    return this.token.asObservable();
  }

  private authenticateSilent(returnUrl: string): Observable<void> {
    const signInSilent = observableFrom(this.manager.signinSilent());
    signInSilent.subscribe(() => {
      this.router.navigateByUrl(returnUrl);
    });

    return signInSilent.pipe(map(x => <any>x));
  }

  private authenticateWithRedirects(returnUrl: string): Observable<void> {
    const signIn = this.manager.signinRedirect({ data: returnUrl });
    return observableFrom(signIn);
  }
}

interface AuthSettings {
  Scope: string
}

export const OIDC_PROVIDER: ClassProvider = {
  multi: true,
  provide: AUTH_PROVIDER_TOKEN,
  useClass: OidcProvider
};
