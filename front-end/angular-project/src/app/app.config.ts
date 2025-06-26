import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { taskReducer } from './store/task/task.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { TaskEffects } from './store/task/task.effects';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor, AuthErrorInterceptor])),
    provideStore({
      auth: authReducer,
      task: taskReducer
    }),
    provideEffects([AuthEffects, TaskEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
