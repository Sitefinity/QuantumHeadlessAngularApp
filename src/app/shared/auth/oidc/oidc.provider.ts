import { Inject, Injectable, InjectionToken } from "@angular/core";
import { AuthProvider, QuantumUser, Token } from "../auth.provider";
import { UserManager, User } from "oidc-client";
import { SettingsService } from "../../services/settings.service";
import { of as observableOf, from as observableFrom, combineLatest as observableCombineLatest, Observable, ReplaySubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AUTH_ROUTE_PATHS } from "../../../app-routing/route-paths";
import { PathLocationStrategy } from "@angular/common";

const OPEN_ID_PATH = "Sitefinity/Authenticate/OpenID";
const FORWARD_SLASH = "/";
export const WINDOW_TOKEN = new InjectionToken("Window");

@Injectable()
export class OidcProvider implements AuthProvider {
  private token = new ReplaySubject<Token>(1);

  private manager: UserManager;
  private settings: any = {
    client_id: "sitefinity",
    response_type: "id_token token",
    scope: "openid profile",
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true
  };
  private static trimForwardSlash(path: string): string {
    let result = path;

    while (result.startsWith(FORWARD_SLASH)) {
      result = result.substring(FORWARD_SLASH.length);
    }

    while (result.endsWith(FORWARD_SLASH)) {
      result = result.substring(0, result.length - FORWARD_SLASH.length);
    }

    return result;
  }

  constructor(settings: SettingsService,
              private http: HttpClient,
              private router: Router,
              private locationStrategy: PathLocationStrategy,
              @Inject(WINDOW_TOKEN) private window: Window) {
    this.settings.authority = `${settings.url}/${OPEN_ID_PATH}`;
    this.settings.post_logout_redirect_uri = this.getAbsoluteUrl(`/auth/oidc/${AUTH_ROUTE_PATHS.SIGN_OUT_REDIRECT}`);
    this.settings.redirect_uri = this.getAbsoluteUrl(`/auth/oidc/${AUTH_ROUTE_PATHS.SIGN_IN_REDIRECT}`);
    this.settings.silent_redirect_uri = this.getAbsoluteUrl("/assets/auth/silent-renew.html");
    this.manager = new UserManager(this.settings);
    this.attachEvents();
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

  private getAbsoluteUrl(urlPath: string): string {
    const baseUrl = this.locationStrategy.getBaseHref();
    const trimmedUrlPath = OidcProvider.trimForwardSlash(urlPath);

    let result = this.window.location.origin;

    if (baseUrl !== FORWARD_SLASH) {
      result = result + baseUrl;
    }

    if (trimmedUrlPath.length === 0) {
      return result;
    }

    if (!result.endsWith(FORWARD_SLASH)) {
      result = result + FORWARD_SLASH;
    }

    result = result + trimmedUrlPath;

    return result;
  }
}
