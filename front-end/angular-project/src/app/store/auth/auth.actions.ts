import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, User } from '../../models/auth.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Token Actions
export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);

export const clearToken = createAction('[Auth] Clear Token');

// Initialize Auth (check if token exists)
export const initializeAuth = createAction('[Auth] Initialize');

export const setAuthenticated = createAction(
  '[Auth] Set Authenticated',
  props<{ isAuthenticated: boolean }>()
);
