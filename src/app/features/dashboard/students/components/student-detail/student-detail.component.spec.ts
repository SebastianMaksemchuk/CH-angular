import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentDetailComponent } from './student-detail.component';
import { StudentsService } from '../../../../../core/services/students.service';
import { CoursesService } from '../../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../../core/services/enrollments.service';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../../../../shared/interfaces/student';
import { Course } from '../../../../../shared/interfaces/course';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';
import { MockProvider } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';

xdescribe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentsService: jasmine.SpyObj<StudentsService>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let enrollmentsService: jasmine.SpyObj<EnrollmentsService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockStudent: Student = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    DOB: new Date('2000-01-01'),
    email: 'john.doe@example.com',
    enrolledCourses: []
  };

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
    const studentsServiceSpy = jasmine.createSpyObj('StudentsService', ['getStudentById']);
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['getCourses']);
    const enrollmentsServiceSpy = jasmine.createSpyObj('EnrollmentsService', ['getEnrollments', 'deleteEnrollment']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    studentsServiceSpy.getStudentById.and.returnValue(of(mockStudent));
    coursesServiceSpy.getCourses.and.returnValue(of(mockCourses));
    enrollmentsServiceSpy.getEnrollments.and.returnValue(of(mockEnrollments));
    enrollmentsServiceSpy.deleteEnrollment.and.returnValue(of(mockEnrollments));
    activatedRouteSpy.snapshot.paramMap.get.and.returnValue('1');

    await TestBed.configureTestingModule({
      declarations: [StudentDetailComponent],
      providers: [
        { provide: StudentsService, useValue: studentsServiceSpy },
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: EnrollmentsService, useValue: enrollmentsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes in the template
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    studentsService = TestBed.inject(StudentsService) as jasmine.SpyObj<StudentsService>;
    coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
    enrollmentsService = TestBed.inject(EnrollmentsService) as jasmine.SpyObj<EnrollmentsService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load student details and related courses and enrollments', () => {
    component.ngOnInit();
    expect(studentsService.getStudentById).toHaveBeenCalledWith('1');
    expect(coursesService.getCourses).toHaveBeenCalled();
    expect(enrollmentsService.getEnrollments).toHaveBeenCalled();
    expect(component.student).toEqual(mockStudent);
    expect(component.courses).toEqual(mockCourses);
    expect(component.enrollments).toEqual(mockEnrollments);
    expect(component.filteredEnrollments).toEqual(mockEnrollments);
    expect(component.student?.enrolledCourses).toEqual(mockCourses);
  });

  it('should update student enrolled courses based on enrollments', () => {
    component.updateStudent();
    expect(component.student?.enrolledCourses).toEqual(mockCourses);
  });

  it('should return the course string representation', () => {
    const courseString = component.getCourse('1');
    expect(courseString).toBe('101 - Course 1');
  });

  it('should delete an enrollment and update the student', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog
    component.deleteEnrollment('1');
    expect(enrollmentsService.deleteEnrollment).toHaveBeenCalledWith('1');
    expect(component.enrollments).toEqual(mockEnrollments);
    expect(component.student?.enrolledCourses).toEqual(mockCourses);
  });
});
