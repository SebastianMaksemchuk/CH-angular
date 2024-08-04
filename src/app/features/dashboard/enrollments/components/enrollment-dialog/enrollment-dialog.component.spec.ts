import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentDialogComponent } from './enrollment-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MockProvider } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { Course } from '../../../../../shared/interfaces/course';
import { Student } from '../../../../../shared/interfaces/student';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../../../shared/shared.module';
import { EnrollmentsRoutingModule } from '../../enrollments-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('EnrollmentDialogComponent', () => {
  let component: EnrollmentDialogComponent;
  let fixture: ComponentFixture<EnrollmentDialogComponent>;
  let dialogRef: MatDialogRef<EnrollmentDialogComponent>;

  const mockCourses$: Observable<Course[]> = of([
    {
      id: '1',
      name: 'Course 1',
      comision: 1,
      startDate: new Date(),
      endDate: new Date(),
      studentQuota: 30,
      enrolledStudents: 20
    }
  ]);

  const mockStudents$: Observable<Student[]> = of([
    {
      id: '1',
      firstName: 'Student 1',
      lastName: 'Lastname 1',
      email: 'student1@example.com',
      DOB: new Date('2000-01-01'),
      enrolledCourses: []
    }
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentDialogComponent],
      imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        EnrollmentsRoutingModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule
      ],
      providers: [
        MockProvider(MatDialogRef),
        { provide: MAT_DIALOG_DATA, useValue: { courses$: mockCourses$, students$: mockStudents$ } },
        provideAnimationsAsync(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.enrollmentForm).toBeDefined();
    expect(component.enrollmentForm.get('studentId')?.value).toEqual('');
    expect(component.enrollmentForm.get('courseId')?.value).toEqual('');
  });

  it('should close the dialog with form value on submit', () => {
    spyOn(dialogRef, 'close');
    
    component.enrollmentForm.setValue({ studentId: '1', courseId: '1' });
    component.onSubmit();
    
    expect(dialogRef.close).toHaveBeenCalledWith({ studentId: '1', courseId: '1' });
  });

  it('should close the dialog on cancel', () => {
    spyOn(dialogRef, 'close');
    
    component.onCancel();
    
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not close the dialog if form is invalid on submit', () => {
    spyOn(dialogRef, 'close');
    
    component.enrollmentForm.setValue({ studentId: '', courseId: '' });
    component.onSubmit();
    
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
