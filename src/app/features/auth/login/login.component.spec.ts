import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logIn']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes in the template
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when fields are correctly filled', () => {
    component.logInForm.controls['email'].setValue('test@example.com');
    component.logInForm.controls['password'].setValue('Valid123!');
    expect(component.logInForm.valid).toBeTrue();
  });

  it('should have an invalid form when fields are incorrectly filled', () => {
    component.logInForm.controls['email'].setValue('invalidemail');
    component.logInForm.controls['password'].setValue('short');
    expect(component.logInForm.invalid).toBeTrue();
  });

  it('should call authService.logIn on submit when form is valid', () => {
    component.logInForm.controls['email'].setValue('test@example.com');
    component.logInForm.controls['password'].setValue('Valid123!');
    component.onSubmit();
    expect(authService.logIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Valid123!'
    });
  });

  it('should not call authService.logIn on submit when form is invalid', () => {
    component.logInForm.controls['email'].setValue('');
    component.logInForm.controls['password'].setValue('');
    spyOn(window, 'alert');
    component.onSubmit();
    expect(authService.logIn).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('El formulario no es valido');
  });

});
