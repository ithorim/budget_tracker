import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem("token");

  if(!token) {
    router.navigate(['login']);
    return false;
  }
  
  return authService.verifyToken().pipe(
    map((response) => {
      if(response.isValid) {
        return true;
      }
      router.navigate(['login']);
      return false;
    }),
    catchError(() => {
      localStorage.removeItem('token');
      router.navigate(['login']);
      return of(false);
    })
  )
};
