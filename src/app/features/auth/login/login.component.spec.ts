import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logIn']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with email and password fields', () => {
    const logInForm = component.logInForm;
    expect(logInForm).toBeTruthy();
    expect(logInForm.get('email')).toBeTruthy();
    expect(logInForm.get('password')).toBeTruthy();
  });

  it('should mark form as invalid when fields are empty', () => {
    component.logInForm.setValue({ email: '', password: '' });
    expect(component.logInForm.invalid).toBeTrue();
  });

  it('should display an alert if the form is invalid on submit', () => {
    spyOn(window, 'alert');
    component.logInForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('El formulario no es valido');
  });

  it('should call authService.logIn when the form is valid on submit', () => {
    const loginData = { email: 'test@example.com', password: 'Password123!' };
    component.logInForm.setValue(loginData);
    component.onSubmit();
    expect(authService.logIn).toHaveBeenCalledWith(loginData);
  });

  it('should have the correct password validation errors', () => {
    const passwordControl = component.logInForm.get('password');
    passwordControl?.setValue('pass');
    expect(passwordControl?.errors?.['upperCase']).toBeTrue();
    expect(passwordControl?.errors?.['numeric']).toBeTrue();
    expect(passwordControl?.errors?.['specialChar']).toBeTrue();
    expect(passwordControl?.errors?.['minLength']).toBeTrue();

    passwordControl?.setValue('Pass123!');
    expect(passwordControl?.errors).toBeNull();
  });
});
