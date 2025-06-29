import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    isLoading: false,
    error
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...initialState
  })),
  
  // Token management
  on(AuthActions.setToken, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: !!token
  })),
  
  on(AuthActions.clearToken, (state) => ({
    ...state,
    token: null,
    isAuthenticated: false,
    user: null
  })),
  
  // Initialize
  on(AuthActions.initializeAuth, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.setAuthenticated, (state, { isAuthenticated }) => ({
    ...state,
    isAuthenticated,
    isLoading: false
  }))
);
