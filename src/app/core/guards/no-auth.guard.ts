import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      take(1), 
      map(isLoggedIn => {
        if (!isLoggedIn) {
          return true; 
        } else {
          this.router.navigate(['/home']); // Redirect if logged in
          return false;
        }
      })
    );
  }
}
