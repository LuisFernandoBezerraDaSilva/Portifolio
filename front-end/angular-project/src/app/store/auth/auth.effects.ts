import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => 
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        this.storageService.setToken(response.token);
        // Navigation will be handled by the component after authentication
      }),
      map(({ response }) => AuthActions.setToken({ token: response.token }))
    )
  );

  logout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess()))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.storageService.clearToken();
        // Navigation will be handled by the component or guard
      })
    ), 
    { dispatch: false }
  );

  initializeAuth$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        const token = this.storageService.getToken();
        if (token) {
          return AuthActions.setToken({ token });
        } else {
          return AuthActions.setAuthenticated({ isAuthenticated: false });
        }
      })
    )
  );
}
