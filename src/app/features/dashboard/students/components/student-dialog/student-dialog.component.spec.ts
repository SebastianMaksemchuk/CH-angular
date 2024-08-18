import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { StudentDialogComponent } from './student-dialog.component';
import { Student } from '../../../../../shared/interfaces/student';
import { SharedModule } from '../../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter, NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';

describe('StudentDialogComponent', () => {
  let component: StudentDialogComponent;
  let fixture: ComponentFixture<StudentDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<StudentDialogComponent>>;
  let mockStudent: Student;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    mockStudent = {
      id: 'efgh',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      DOB: new Date()
    };

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule
      ],
      declarations: [StudentDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockStudent },
        { provide: DateAdapter, useClass: NativeDateAdapter },
        provideNativeDateAdapter(),
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<StudentDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.studentForm.contains('firstName')).toBeTrue();
    expect(component.studentForm.contains('lastName')).toBeTrue();
    expect(component.studentForm.contains('DOB')).toBeTrue();
    expect(component.studentForm.contains('email')).toBeTrue();
  });

  it('should make the firstName control required', () => {
    const control = component.studentForm.get('firstName');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should make the lastName control required', () => {
    const control = component.studentForm.get('lastName');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should make the DOB control required', () => {
    const control = component.studentForm.get('DOB');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should make the email control required and validate email format', () => {
    const control = component.studentForm.get('email');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
    control!.setValue('invalid-email');
    expect(control!.valid).toBeFalse();
    control!.setValue('valid.email@example.com');
    expect(control!.valid).toBeTrue();
  });

  it('should initialize form with provided student data', () => {
    expect(component.studentForm.value).toEqual({
      id: 'efgh',
      firstName: 'Jane',
      lastName: 'Doe',
      DOB: jasmine.any(Date),
      email: 'jane.doe@example.com'
    });
  });

  it('should close dialog with form value on submit if form is valid', () => {
    component.studentForm.setValue({
      id: 'efgh',
      firstName: 'Jane',
      lastName: 'Doe',
      DOB: new Date('2000-01-01T00:00:00Z'),
      email: 'jane.doe@example.com'
    });
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      id: 'efgh',
      firstName: 'Jane',
      lastName: 'Doe',
      DOB: jasmine.any(Date),
      email: 'jane.doe@example.com'
    });
  });
  
  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
