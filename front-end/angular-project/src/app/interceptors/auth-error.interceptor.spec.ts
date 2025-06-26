import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError, of, EMPTY } from 'rxjs';
import { AuthErrorInterceptor } from './auth-error.interceptor';

describe('AuthErrorInterceptor', () => {
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let mockNext: jasmine.SpyObj<HttpHandler>;

  const executeInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => AuthErrorInterceptor(req, next));

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockNext = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should redirect to login on 403 error', () => {
    const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
    mockNext.handle.and.returnValue(throwError(() => error));
    
    const request = new HttpRequest('GET', '/test');
    
    executeInterceptor(request, mockNext.handle).subscribe({
      next: () => {},
      error: () => {},
      complete: () => {
        expect(snackBar.open).toHaveBeenCalledWith('Session Expired!', 'Close', { duration: 3000 });
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }
    });
  });

  it('should pass through other errors', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    mockNext.handle.and.returnValue(throwError(() => error));
    
    const request = new HttpRequest('GET', '/test');
    
    executeInterceptor(request, mockNext.handle).subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBe(error);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(snackBar.open).not.toHaveBeenCalled();
      }
    });
  });

  it('should pass through successful requests', () => {
    const response = { status: 200 };
    mockNext.handle.and.returnValue(of(response as any));
    
    const request = new HttpRequest('GET', '/test');
    
    executeInterceptor(request, mockNext.handle).subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
      }
    });
  });
});
