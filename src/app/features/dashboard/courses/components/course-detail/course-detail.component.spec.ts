import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CourseDetailComponent } from './course-detail.component';
import { CoursesService } from '../../../../../core/services/courses.service';
import { StudentsService } from '../../../../../core/services/students.service';
import { EnrollmentsService } from '../../../../../core/services/enrollments.service';
import { Course } from '../../../../../shared/interfaces/course';
import { Student } from '../../../../../shared/interfaces/student';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let coursesService: CoursesService;
  let studentsService: StudentsService;
  let enrollmentsService: EnrollmentsService;

  const mockCourse: Course = {
    id: '1',
    comision: 101,
    name: 'Test Course',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    studentQuota: 30,
    enrolledStudents: [],
  };

  const mockStudents: Student[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
    { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
  ];

  const mockEnrollments: Enrollment[] = [
    { id: '1', studentId: '1', courseId: '1' },
    { id: '2', studentId: '2', courseId: '1' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [CourseDetailComponent],
      providers: [
        MockProvider(CoursesService, {
          getCourseById: () => of(mockCourse),
        }),
        MockProvider(StudentsService, {
          getStudents: () => of(mockStudents),
        }),
        MockProvider(EnrollmentsService, {
          getEnrollments: () => of(mockEnrollments),
          deleteEnrollment: (id: string) => of(mockEnrollments.filter(e => e.id !== id)),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load course details and update course information', (done) => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.course).toEqual(mockCourse);
      expect(component.students).toEqual(mockStudents);
      expect(component.enrollments).toEqual(mockEnrollments);
      expect(component.filteredEnrollments.length).toBe(2);
      expect(component.course?.enrolledStudents.length).toBe(2);
      done();
    });
  });

  it('should delete an enrollment and update the course', (done) => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteEnrollment('1');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.enrollments.length).toBe(1);
      expect(component.enrollments[0].id).toBe('2');
      expect(component.course?.enrolledStudents.length).toBe(1);
      done();
    });
  });

  it('should return student name', () => {
    expect(component.getStudentName('1')).toBe('1 - John Doe');
    expect(component.getStudentName('non-existent')).toBe('Unknown');
  });
});
