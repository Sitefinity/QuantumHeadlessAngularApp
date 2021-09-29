import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {Observable, of, ReplaySubject} from 'rxjs';
import { AuthService } from "./auth.service";
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const isLoggedInSubject = new ReplaySubject<boolean>(1);
    this.authService.init().subscribe(() => {
      this.authService.isLoggedIn().subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.authService.signIn(state.url).pipe(
            catchError(err => {
              console.log(err);
              return of([]);
            })
          ).subscribe(
            res => console.log('HTTP response', res),
            err => console.log('HTTP Error', err)
            );
        }

        isLoggedInSubject.next(isLoggedIn);
        isLoggedInSubject.complete();
      });
    });

    return isLoggedInSubject.asObservable();
  }
}
