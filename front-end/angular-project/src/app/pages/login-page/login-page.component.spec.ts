import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['setToken', 'setUserId']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, BrowserAnimationsModule, HttpClientTestingModule, FormsModule]
    })
    .overrideProvider(AuthService, { useValue: authServiceSpy })
    .overrideProvider(StorageService, { useValue: storageServiceSpy })
    .overrideProvider(Router, { useValue: routerSpy })
    .overrideProvider(MatSnackBar, { useValue: snackBarSpy })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty username and password', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('should navigate to user creation page', () => {
    component.createAccount();
    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('should call router navigate on createAccount', () => {
    spyOn(console, 'log'); // Spy on console.log to avoid output
    component.createAccount();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('should login successfully with valid credentials', fakeAsync(() => {
    const mockResponse = { token: 'mock-token', userId: 123 };
    authService.login.and.returnValue(of(mockResponse));
    
    component.username = 'testuser';
    component.password = 'testpass';
    
    const mockForm = jasmine.createSpyObj('NgForm', [], {
      invalid: false,
      controls: {
        username: { markAsTouched: jasmine.createSpy() },
        password: { markAsTouched: jasmine.createSpy() }
      }
    });

    component.login(mockForm);
    tick(); // Advance the virtual clock to handle async operations

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpass' });
    expect(storageService.setToken).toHaveBeenCalledWith('mock-token');
    expect(storageService.setUserId).toHaveBeenCalledWith(123);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('should show error message for invalid form', fakeAsync(() => {
    const mockForm = jasmine.createSpyObj('NgForm', [], {
      invalid: true,
      controls: {
        username: { markAsTouched: jasmine.createSpy() },
        password: { markAsTouched: jasmine.createSpy() }
      }
    });

    component.login(mockForm);
    tick(); // Advance the virtual clock to handle async operations

    expect(snackBar.open).toHaveBeenCalledWith('Please fill in all required fields!', 'Close', { duration: 3000 });
    expect(mockForm.controls.username.markAsTouched).toHaveBeenCalled();
    expect(mockForm.controls.password.markAsTouched).toHaveBeenCalled();
  }));

  it('should handle 401 login error', fakeAsync(() => {
    const error = { status: 401 };
    authService.login.and.returnValue(throwError(() => error));
    
    component.username = 'testuser';
    component.password = 'wrongpass';
    
    const mockForm = { invalid: false };
    component.login(mockForm);
    tick(); // Advance the virtual clock to handle async operations

    expect(snackBar.open).toHaveBeenCalledWith('Incorrect password!', 'Close', { duration: 3000 });
  }));

  it('should handle general login error', fakeAsync(() => {
    const error = { status: 500 };
    authService.login.and.returnValue(throwError(() => error));
    
    component.username = 'testuser';
    component.password = 'testpass';
    
    const mockForm = { invalid: false };
    component.login(mockForm);
    tick(); // Advance the virtual clock to handle async operations

    expect(snackBar.open).toHaveBeenCalledWith('Error logging in!', 'Close', { duration: 3000 });
  }));
});
