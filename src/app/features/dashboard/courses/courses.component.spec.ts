import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CoursesComponent } from './courses.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { CoursesActions } from './store/courses.actions';
import { RootState } from '../../../core/store/store';
import { Course } from '../../../shared/interfaces/course';
import { User } from '../../../shared/interfaces/user';
import { SharedModule } from '../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { selectCourses } from './store/courses.selectors';
import { RouterTestingModule } from '@angular/router/testing';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let store: MockStore<RootState>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockCourse: Course;
  let mockUser: User;

  const initialState = {
    courses: [{
      id: 'efgh',
      comision: 123567,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    }],
    coursesError: null,
    coursesIsLoading: false,
    authUser: null
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [CoursesComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    mockCourse = {
      id: 'efgh',
      comision: 123567,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    };

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '',
      adress: '',
      password: 'password123',
      role: 'ADMIN',
      token: 'abcde12345'
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    store.overrideSelector(selectCourses, [{
      id: 'efgh',
      comision: 123567,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCourses action on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.loadCourses());
  });

  it('should dispatch unsetCoursesStore action on ngOnDestroy', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.unsetCoursesStore());
  });

  it('should open course dialog and dispatch createCourse if no course is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockCourse));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openCourseDialog();
    expect(matDialog.open).toHaveBeenCalledWith(CourseDialogComponent, { data: { course: undefined, teachers$: component.teachers$ } });
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.createCourse({ payload: mockCourse }));
  });

  it('should open course dialog and dispatch editCourse if course is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockCourse));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openCourseDialog(mockCourse);
    expect(matDialog.open).toHaveBeenCalledWith(CourseDialogComponent, { data: { course: mockCourse, teachers$: component.teachers$ } });
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.editCourse({ id: mockCourse.id, payload: mockCourse }));
  });

  it('should dispatch deleteCourse action on deleteCourseById', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteCourseById(mockCourse.id);
    expect(dispatchSpy).toHaveBeenCalledWith(CoursesActions.deleteCourse({ id: mockCourse.id }));
  });

  it('should not dispatch deleteCourse action if confirm returns false', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteCourseById(mockCourse.id);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
