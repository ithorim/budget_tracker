import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // if there is no token, allow access to login/register
  if(!token) {
    return true;
  }

  return authService.verifyToken().pipe(
    map((response) => { // if token is valid, redirect to home
      if(response.isValid) {
        router.navigate(['dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      localStorage.removeItem('token'); // Clean up invalid token
      return of(true);  // Allow access to login page
    })
  );
};
