import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        snackBar.open('Session Expired!', 'Close', { duration: 3000 });
        router.navigate(['/login']);
        return EMPTY; 
      }
      return throwError(() => error);
    })
  );
};