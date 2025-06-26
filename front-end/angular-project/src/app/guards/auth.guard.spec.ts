import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { StorageService } from '../services/storage.service';

describe('authGuard', () => {
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when token exists', () => {
    storageService.getToken.and.returnValue('valid-token');
    
    const result = executeGuard({} as any, {} as any);
    
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when no token', () => {
    storageService.getToken.and.returnValue(null);
    
    const result = executeGuard({} as any, {} as any);
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
