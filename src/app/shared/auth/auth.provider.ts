import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
export const AUTH_PROVIDER_TOKEN = new InjectionToken("auth_provider");

export interface AuthProvider {
  signIn(returnUrl: string): Observable<void>;
  signOut(): Observable<void>;
  isLoggedIn(): Observable<boolean>;
  getToken(): Observable<Token>;
  isAvailable(): Observable<boolean>;
}

export interface Token {
  type: string,
  value: string
}
