import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, ReplaySubject } from "rxjs";
import { AuthService } from "./auth.service";

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
          this.authService.signIn(state.url).subscribe();
        }

        isLoggedInSubject.next(isLoggedIn);
        isLoggedInSubject.complete();
      });
    });

    return isLoggedInSubject.asObservable();
  }
}
