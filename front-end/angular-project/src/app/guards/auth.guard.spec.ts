import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, GuardResult } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, Observable } from 'rxjs';
import { authGuard } from './auth.guard';
import * as AuthSelectors from '../store/auth/auth.selectors';

describe('authGuard', () => {
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null
    }
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy }
      ]
    });

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when authenticated', (done) => {
    store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);
    store.refreshState();
    
    const result = executeGuard({} as any, {} as any);
    
    if (result && typeof result === 'object' && 'subscribe' in result) {
      (result as Observable<GuardResult>).subscribe((canActivate: GuardResult) => {
        expect(canActivate).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    }
  });

  it('should deny access and redirect when not authenticated', (done) => {
    store.overrideSelector(AuthSelectors.selectIsAuthenticated, false);
    store.refreshState();
    
    const result = executeGuard({} as any, {} as any);
    
    if (result && typeof result === 'object' && 'subscribe' in result) {
      (result as Observable<GuardResult>).subscribe((canActivate: GuardResult) => {
        expect(canActivate).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
    } else {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    }
  });
});
