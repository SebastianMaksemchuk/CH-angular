import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { UserDialogComponent } from './user-dialog.component';
import { User, UserRole } from '../../../../../shared/interfaces/user';
import { SharedModule } from '../../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserDialogComponent>>;
  let mockUser: User;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      role: 'TEACHER',
      token: 'token12345'
    };

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule
      ],
      declarations: [UserDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockUser }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.userForm.contains('firstName')).toBeTrue();
    expect(component.userForm.contains('lastName')).toBeTrue();
    expect(component.userForm.contains('email')).toBeTrue();
    expect(component.userForm.contains('password')).toBeTrue();
    expect(component.userForm.contains('role')).toBeTrue();
  });

  it('should make the firstName control required', () => {
    const control = component.userForm.get('firstName');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should validate the lastName control pattern', () => {
    const control = component.userForm.get('lastName');
    expect(control).toBeTruthy();
    control!.setValue('invalid_lastname');
    expect(control!.valid).toBeFalse();
    control!.setValue('Valid Lastname');
    expect(control!.valid).toBeTrue();
  });

  it('should validate email control', () => {
    const control = component.userForm.get('email');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
    control!.setValue('invalid-email');
    expect(control!.valid).toBeFalse();
    control!.setValue('valid.email@example.com');
    expect(control!.valid).toBeTrue();
  });

  it('should validate password control with custom validator', () => {
    const control = component.userForm.get('password');
    expect(control).toBeTruthy();
    control!.setValue('short');
    expect(control!.valid).toBeFalse();
    control!.setValue('Valid1Password!');
    expect(control!.valid).toBeTrue();
  });

  it('should set default role to TEACHER if not provided', () => {
    expect(component.userForm.get('role')!.value).toBe('TEACHER');
  });

  it('should close dialog with form value on submit if form is valid', () => {
    component.userForm.setValue({
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      role: 'TEACHER',
      token: 'token12345'
    });
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      role: 'TEACHER',
      token: 'token12345'
    });
  });

  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
