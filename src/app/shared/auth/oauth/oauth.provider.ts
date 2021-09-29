import { Observable, of, ReplaySubject} from 'rxjs';
import { catchError, map } from "rxjs/operators";
import {AuthProvider, Token, AUTH_PROVIDER_TOKEN} from '../auth.provider';
import { Injectable, ClassProvider, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../services/settings.service";
import { AUTH_ROUTE_PATHS } from '../../../app-routing/route-paths';
import { UrlService } from '../../services/url.service';
import {WINDOW_TOKEN} from '../../common.constants';

const OAUTH_PATH = "Sitefinity/oauth";
const OAUTH_PROVIDER_NAME = "oauth";
const LOGOUT_URL_NO_STS = "/signout?sts_signout=false&redirect_uri=";

@Injectable()
export class OauthProvider implements AuthProvider {
    private static tokenSubject = new ReplaySubject<Token>(1);
    private static token: OAuthToken;
    private settings = {
        client_id: "sitefinity",
        response_type: "token",
        automaticSilentRenew: false,
        filterProtocolClaims: true,
        loadUserInfo: false,
        authority: null,
        post_logout_redirect_uri: null,
        redirect_uri: null
    };

    constructor(private http: HttpClient,
                private urlService: UrlService,
                private settingsProv: SettingsService,
                @Inject(WINDOW_TOKEN) private window: Window) {
    }

    static setToken(token: OAuthToken) {
        OauthProvider.tokenSubject.next({
            type: token.type,
            value: token.value
        });

        OauthProvider.token = token;
    }

    init(): Observable<void> {
        this.initSettingsObj();
        return of(null);
    }

    signIn(returnUrl: string): Observable<void> {
        const redirectUri = encodeURIComponent(this.settings.redirect_uri);
        const encodedReturnUrl = encodeURIComponent(encodeURIComponent(returnUrl));
        const url = this.settings.authority + `/authorize?response_type=token&client_id=${this.settings.client_id}&redirect_uri=${redirectUri}&state=${encodedReturnUrl}`;
        this.window.location.href = url;
        return of(null);
    }

    signOut(returnUrl?: string): Observable<void> {
        if (!returnUrl) {
            returnUrl = this.urlService.getAbsoluteUrl("/");
        }

        returnUrl = encodeURIComponent(returnUrl);
        const redirectUrl = `${this.settingsProv.url}/Sitefinity${LOGOUT_URL_NO_STS}${returnUrl}`;
        this.window.location.href = redirectUrl;
        return of();
    }

    isLoggedIn(): Observable<boolean> {
        const result = !!OauthProvider.token && OauthProvider.token.expirationTime > new Date();
        return of(result);
    }

    getToken(): Observable<Token> {
        return OauthProvider.tokenSubject.asObservable();
    }

    getName(): string {
        return OAUTH_PROVIDER_NAME;
    }

    getPriority(): number {
        return 1;
    }

    isAvailable(): Observable<boolean> {
        this.initSettingsObj();
        const url = `${this.settingsProv.url}/sitefinity/authentication/info`;
        return this.http.get(url, { observe: "response", responseType: "text" }).pipe(
            map(x => {
                const header = x.headers.get("content-type");
                if (header && header.startsWith("application/json")) {
                    const result = JSON.parse(x.body);
                    return result.protocol === "Default";
                }

                return false;
            }),
            catchError(error => {
                return of(false);
            })
        );
    }

    private initSettingsObj(): any {
        if (!this.settings.authority && this.settingsProv.url) {
            this.settings.authority = `${this.settingsProv.url}/${OAUTH_PATH}`;
            this.settings.post_logout_redirect_uri = this.urlService.getAbsoluteUrl(`/auth/oauth/${AUTH_ROUTE_PATHS.SIGN_OUT_REDIRECT}`);
            this.settings.redirect_uri = this.urlService.getAbsoluteUrl(`/auth/oauth/${AUTH_ROUTE_PATHS.SIGN_IN_REDIRECT}`);
        }
    }
}

export const OAUTH_PROVIDER: ClassProvider = {
    multi: true,
    provide: AUTH_PROVIDER_TOKEN,
    useClass: OauthProvider
};

export class OAuthToken implements Token {
    type: string;
    value: string;
    expirationTime: Date;
}
