import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
export const AUTH_PROVIDER_TOKEN = new InjectionToken("auth_provider");

export interface AuthProvider {
  signIn(returnUrl: string): Observable<void>;
  signOut(): Observable<void>;
  isLoggedIn(): Observable<boolean>;
  getPriority(): number;
  isAvailable(): Observable<boolean>;
  getName(): string;
  getToken(): Observable<Token>;
  init(): Observable<void>;
}

export interface Token {
  type: string;
  value: string;
}

export class QuantumUser {
  Username: string;
  Picture: string;
}
