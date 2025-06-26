import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { StorageService } from '../services/storage.service';

describe('jwtInterceptor', () => {
  let storageService: jasmine.SpyObj<StorageService>;
  let mockNext: jasmine.SpyObj<HttpHandler>;

  const executeInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getToken']);
    mockNext = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should not add Authorization header when no token', () => {
    storageService.getToken.and.returnValue(null);
    
    const request = new HttpRequest('GET', '/test');
    executeInterceptor(request, mockNext.handle);

    expect(mockNext.handle).toHaveBeenCalledWith(request);
  });

  it('should add Authorization header when token exists', () => {
    const token = 'test-token';
    storageService.getToken.and.returnValue(token);
    
    const request = new HttpRequest('GET', '/test');
    executeInterceptor(request, mockNext.handle);

    // Verify that handle was called with a request that has the Authorization header
    expect(mockNext.handle).toHaveBeenCalled();
    const calledRequest = mockNext.handle.calls.mostRecent().args[0];
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle errors gracefully', () => {
    storageService.getToken.and.throwError('Storage error');
    
    const request = new HttpRequest('GET', '/test');
    
    expect(() => executeInterceptor(request, mockNext.handle)).not.toThrow();
    expect(mockNext.handle).toHaveBeenCalledWith(request);
  });
});
