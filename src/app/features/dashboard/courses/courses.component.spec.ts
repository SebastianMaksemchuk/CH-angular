import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CoursesComponent } from './courses.component';
import { CoursesService } from '../../../core/services/courses.service';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from '../../../shared/interfaces/course';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { MockProvider } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let enrollmentsService: jasmine.SpyObj<EnrollmentsService>;

  const mockCourses: Course[] = [
    {
      id: '1',
      comision: 101,
      name: 'Course 1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      studentQuota: 30,
      enrolledStudents: []
    }
  ];

  const mockEnrollments: Enrollment[] = [
    {
      id: '1',
      courseId: '1',
      studentId: '1'
    }
  ];

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['getCourses', 'addCourse', 'deleteCourseById']);
    const enrollmentsServiceSpy = jasmine.createSpyObj('EnrollmentsService', ['getEnrollments']);

    coursesServiceSpy.getCourses.and.returnValue(of(mockCourses));
    coursesServiceSpy.addCourse.and.returnValue(of([...mockCourses, mockCourses[0]])); // Mock adding a course
    coursesServiceSpy.deleteCourseById.and.returnValue(of(mockCourses.slice(1))); // Mock deleting a course
    enrollmentsServiceSpy.getEnrollments.and.returnValue(of(mockEnrollments));
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(mockCourses[0])
    } as any);

    await TestBed.configureTestingModule({
      declarations: [CoursesComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: EnrollmentsService, useValue: enrollmentsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes in the template
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
    enrollmentsService = TestBed.inject(EnrollmentsService) as jasmine.SpyObj<EnrollmentsService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses and enrollments on initialization', () => {
    component.ngOnInit();
    expect(coursesService.getCourses).toHaveBeenCalled();
    expect(enrollmentsService.getEnrollments).toHaveBeenCalled();
    expect(component.courses).toEqual(mockCourses);
    expect(component.enrollments).toEqual(mockEnrollments);
    expect(component.dataSource).toEqual([
      {
        id: '1',
        comision: 101,
        name: 'Course 1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        enrolledCount: 1
      }
    ]);
  });

  it('should open the dialog and add a new course', () => {
    component.openDialog();
    expect(dialog.open).toHaveBeenCalledWith(CourseDialogComponent);
    expect(coursesService.addCourse).toHaveBeenCalledWith(mockCourses[0]);
    expect(component.courses).toEqual([...mockCourses, mockCourses[0]]);
    expect(component.dataSource).toEqual([
      {
        id: '1',
        comision: 101,
        name: 'Course 1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        enrolledCount: 1
      },
      {
        id: '1',
        comision: 101,
        name: 'Course 1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        enrolledCount: 1
      }
    ]);
  });

  it('should open the dialog and edit a course', () => {
    const courseToEdit = mockCourses[0];
    component.editCourse(courseToEdit);
    expect(dialog.open).toHaveBeenCalledWith(CourseDialogComponent, { data: courseToEdit });
    expect(component.courses).toContain(courseToEdit);
    expect(component.dataSource).toEqual([
      {
        id: '1',
        comision: 101,
        name: 'Course 1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        enrolledCount: 1
      }
    ]);
  });

  it('should delete a course by ID', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog
    component.deleteCourseById('1');
    expect(coursesService.deleteCourseById).toHaveBeenCalledWith('1');
    expect(component.courses).toEqual(mockCourses.slice(1));
    expect(component.dataSource).toEqual([]);
  });

});
