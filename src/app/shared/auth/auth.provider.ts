import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
export const AUTH_PROVIDER_TOKEN = new InjectionToken('auth_provider');

export interface AuthProvider {
  signIn(returnUrl: string): Observable<void>;
  signOut(): Observable<void>;
  isLoggedIn(): Observable<boolean>;
  getUser(): Observable<any>;
  getToken(): Observable<Token>;
}

export interface Token {
  type: string;
  value: string;
}

export class QuantumUser {
  Username: string;
  Picture: string;
}
