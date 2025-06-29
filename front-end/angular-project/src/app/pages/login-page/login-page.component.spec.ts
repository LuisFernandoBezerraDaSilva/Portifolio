import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginPageComponent } from './login-page.component';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let store: MockStore;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const initialState = {
    auth: {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      authenticated: false
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, BrowserAnimationsModule, HttpClientTestingModule, FormsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    store = TestBed.inject(Store) as MockStore;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    
    spyOn(store, 'dispatch');
    // Don't call fixture.detectChanges() here to avoid ngOnInit interference
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

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ 
      credentials: { username: 'testuser', password: 'testpass' }
    }));
  }));

  // Test form validation without complex object structures
  it('should validate form correctly', () => {
    const invalidForm = { 
      invalid: true,
      controls: {
        username: { markAsTouched: jasmine.createSpy('markAsTouched') },
        password: { markAsTouched: jasmine.createSpy('markAsTouched') }
      }
    };
    
    const validForm = { 
      invalid: false,
      controls: {
        username: { markAsTouched: jasmine.createSpy('markAsTouched') },
        password: { markAsTouched: jasmine.createSpy('markAsTouched') }
      }
    };
    
    // Set component properties needed for valid form submission
    component.username = 'testuser';
    component.password = 'testpass';
    
    // Test that we can call the login method without errors
    expect(() => component.login(invalidForm)).not.toThrow();
    expect(() => component.login(validForm)).not.toThrow();
    
    // Verify that markAsTouched is called for invalid forms
    expect(invalidForm.controls.username.markAsTouched).toHaveBeenCalled();
    expect(invalidForm.controls.password.markAsTouched).toHaveBeenCalled();
    
    // For valid form, markAsTouched should not be called
    expect(validForm.controls.username.markAsTouched).not.toHaveBeenCalled();
    expect(validForm.controls.password.markAsTouched).not.toHaveBeenCalled();
  });

  it('should dispatch login action on valid form submission', () => {
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

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ 
      credentials: { username: 'testuser', password: 'testpass' }
    }));
  });
});
