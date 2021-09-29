import { Inject, Injectable } from "@angular/core";
import { of as observableOf, Observable, ReplaySubject, Subject } from "rxjs";
import {filter, map, mergeMap} from 'rxjs/operators';
import { OidcProvider } from "./oidc/oidc.provider";
import { AUTH_PROVIDER_TOKEN, AuthProvider, Token } from "./auth.provider";
import { SitefinityService } from "../services/sitefinity.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private provider: AuthProvider = null;
  private currentToken: Token = null;

  constructor(@Inject(AUTH_PROVIDER_TOKEN) private providers: AuthProvider[], private sitefinity: SitefinityService) { }

  init(): Observable<any> {
    if (this.provider) {
      return observableOf(this.provider);
    }

    return this.getProvider();
  }

  signIn(returnUrl: string): Observable<void> {
    return this.provider.signIn(returnUrl);
  }

  isLoggedIn(): Observable<boolean> {
    if (!this.provider) {
      return observableOf(false);
    }

    return this.provider.isLoggedIn();
  }

  private getProvider(): Observable<AuthProvider> {
    // the provider is an observable as we do not know which provider we have to work with - oidc or oauth
    const ready = new ReplaySubject<AuthProvider>(1);

    const sortedProviders = this.providers.sort((a, b) => {
      if (a.getPriority() > b.getPriority()) {
        return 1;
      } else if (a.getPriority() < b.getPriority()) {
        return -1;
      }

      return 0;
    });

    let availableProv = observableOf({ provider: null, value: false });

    for (let i = 0; i < sortedProviders.length; i++) {
      availableProv = availableProv.pipe(mergeMap((result) => {
        if (result.value === false) {
          return sortedProviders[i].isAvailable().pipe(map(x => {
            return {
              provider: sortedProviders[i],
              value: x
            };
          }));
        }

        return observableOf(result);
      }));
    }

    availableProv.pipe(map(x => x.provider)).subscribe((provider) => {
      this.initProvider(ready, provider);
    });

    return ready.asObservable();
  }

  private initProvider(ready: Subject<AuthProvider>, provider: AuthProvider) {
    this.provider = provider;
    this.provider.getToken().pipe(filter(x => !!x)).subscribe((token) => {
      this.currentToken = token;
      this.sitefinity.token = {
        type: token.type,
        value: token.value
      };
    });

    this.provider.init().subscribe(() => {
      ready.next(this.provider);
      ready.complete();
    });
  }
}
