import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { EnrollmentsComponent } from './enrollments.component';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { EnrollmentsActions } from './store/enrollments.actions';
import { CoursesActions } from '../courses/store/courses.actions';
import { StudentsActions } from '../students/store/students.actions';
import { RootState } from '../../../core/store/store';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { Student } from '../../../shared/interfaces/student';
import { Course } from '../../../shared/interfaces/course';
import { SharedModule } from '../../../shared/shared.module';

describe('EnrollmentsComponent', () => {
  let component: EnrollmentsComponent;
  let fixture: ComponentFixture<EnrollmentsComponent>;
  let store: MockStore<RootState>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockEnrollment: Enrollment;
  let mockStudent: Student;
  let mockCourse: Course;

  const initialState = {
    enrollments: [],
    enrollmentsError: null,
    enrollmentsIsLoading: false,
    courses: [],
    students: [],
    auth: {
      authUser: {
        id: 'wxyz',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        adress: '',
        password: '',
        role: '',
        token: ''
      }
    }
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EnrollmentsComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    mockEnrollment = {
      id: 'ijkl',
      courseId: 'efgh',
      studentId: 'abcd',
      enrollmentDate: new Date(),
      enrolledByUserId: 'wxyz'
    };

    mockStudent = {
      id: 'abcd',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      DOB: new Date()
    };

    mockCourse = {
      id: 'efgh',
      comision: 123567,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01')
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEnrollments, loadCourses, and loadStudents actions on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(EnrollmentsActions.loadEnrollments());
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.loadCourses());
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.loadStudents());
  });

  it('should dispatch unsetEnrollmentsStore action on ngOnDestroy', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(EnrollmentsActions.unsetEnrollmentsStore());
  });

  it('should open enrollment dialog and dispatch createEnrollment if result is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of({
      id: mockEnrollment.id,
      courseId: mockEnrollment.courseId,
      studentId: mockEnrollment.studentId
    }));
    const dispatchSpy = spyOn(store, 'dispatch');
    const authUserId = 'wxyz';

    component.openEnrollmentDialog();
    expect(matDialog.open).toHaveBeenCalledWith(EnrollmentDialogComponent, {
      data: {
        courses$: component.courses$,
        students$: component.students$
      }
    });

    component.authUserId$.subscribe(userId => {
      const expectedEnrollment = {
        id: mockEnrollment.id,
        courseId: mockEnrollment.courseId,
        studentId: mockEnrollment.studentId,
        enrollmentDate: mockEnrollment.enrollmentDate,
        enrolledByUserId: authUserId
      };
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        payload: jasmine.objectContaining({
          enrollmentDate: jasmine.any(Date)
        })
      }));
    });
  });

  it('should dispatch deleteEnrollment action on deleteEnrollmentById', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteEnrollmentById(mockEnrollment.id);
    expect(dispatchSpy).toHaveBeenCalledWith(EnrollmentsActions.deleteEnrollment({ id: mockEnrollment.id }));
  });

  it('should not dispatch deleteEnrollment action if confirm returns false', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteEnrollmentById(mockEnrollment.id);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
