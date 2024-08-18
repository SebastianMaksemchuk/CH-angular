import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { EnrollmentDialogComponent } from './enrollment-dialog.component';
import { Course } from '../../../../../shared/interfaces/course';
import { Student } from '../../../../../shared/interfaces/student';
import { SharedModule } from '../../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EnrollmentDialogComponent', () => {
  let component: EnrollmentDialogComponent;
  let fixture: ComponentFixture<EnrollmentDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EnrollmentDialogComponent>>;
  let mockCourses$: Observable<Course[]>;
  let mockStudents$: Observable<Student[]>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    mockCourses$ = of([
      { id: 'abcd', comision: 12345, name: 'Angular', startDate: new Date(), endDate: new Date() }
    ]);
    mockStudents$ = of([
      { id: 'efgh', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', DOB: new Date() }
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule
      ],
      declarations: [EnrollmentDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { courses$: mockCourses$, students$: mockStudents$ } }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EnrollmentDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.enrollmentForm.contains('studentId')).toBeTrue();
    expect(component.enrollmentForm.contains('courseId')).toBeTrue();
  });

  it('should make the studentId control required', () => {
    const control = component.enrollmentForm.get('studentId');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should make the courseId control required', () => {
    const control = component.enrollmentForm.get('courseId');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control!.valid).toBeFalse();
  });

  it('should close dialog with form value on submit if form is valid', () => {
    component.enrollmentForm.setValue({ studentId: 'student1', courseId: 'course1' });
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({ studentId: 'student1', courseId: 'course1' });
  });

  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
