import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { StorageService } from '../services/storage.service';

describe('jwtInterceptor', () => {
  let storageService: jasmine.SpyObj<StorageService>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;

  const executeInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getToken']);
    mockNext = jasmine.createSpy('next').and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(executeInterceptor).toBeTruthy();
  });

  it('should not modify request when no token exists', () => {
    storageService.getToken.and.returnValue(null);
    
    const originalRequest = new HttpRequest('GET', '/test');
    executeInterceptor(originalRequest, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const calledRequest = mockNext.calls.mostRecent().args[0];
    expect(calledRequest.headers.has('Authorization')).toBe(false);
  });

  it('should add Authorization header when token exists', () => {
    const token = 'test-token';
    storageService.getToken.and.returnValue(token);
    
    const originalRequest = new HttpRequest('GET', '/test');
    executeInterceptor(originalRequest, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const calledRequest = mockNext.calls.mostRecent().args[0];
    expect(calledRequest.headers.has('Authorization')).toBe(true);
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle storage service errors gracefully', () => {
    storageService.getToken.and.throwError('Storage error');
    
    const originalRequest = new HttpRequest('GET', '/test');
    
    expect(() => executeInterceptor(originalRequest, mockNext)).not.toThrow();
    expect(mockNext).toHaveBeenCalledWith(originalRequest);
  });

  it('should preserve original request when token is empty string', () => {
    storageService.getToken.and.returnValue('');
    
    const originalRequest = new HttpRequest('GET', '/test');
    executeInterceptor(originalRequest, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const calledRequest = mockNext.calls.mostRecent().args[0];
    expect(calledRequest.headers.has('Authorization')).toBe(false);
  });
});
