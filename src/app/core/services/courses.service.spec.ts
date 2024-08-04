import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { MockProvider } from 'ng-mocks';
import { EnrollmentsService } from './enrollments.service';
import { Course } from '../../shared/interfaces/course';
import { of } from 'rxjs';

describe('CoursesService', () => {
  let service: CoursesService;
  let enrollmentsService: EnrollmentsService;
  let httpController: HttpTestingController;

  const coursesUrl = environment.apiUrl + 'courses';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
        MockProvider(EnrollmentsService),
      ],
    });
    service = TestBed.inject(CoursesService);
    enrollmentsService = TestBed.inject(EnrollmentsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch courses', () => {
    const mockCourses: Course[] = [
      { id: '1', name: 'Course 1', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [], comision: 1 },
    ];

    service.getCourses().subscribe((courses) => {
      expect(courses).toEqual(mockCourses);
    });

    const req = httpController.expectOne(coursesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should fetch course by ID', () => {
    const mockCourse: Course = { id: '1', name: 'Course 1', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [], comision: 1 };

    service.getCourseById('1').subscribe((course) => {
      expect(course).toEqual(mockCourse);
    });

    const req = httpController.expectOne(coursesUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockCourse]);
  });

  it('should add a new course', () => {
    const newCourse: Course = { id: '2', name: 'Course 2', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [], comision: 2 };

    service.addCourse(newCourse).subscribe((courses) => {
      expect(courses).toContain(newCourse);
    });

    const req = httpController.expectOne(coursesUrl);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', name: 'Course 1', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [], comision: 1 }]);

    const reqPost = httpController.expectOne(coursesUrl);
    expect(reqPost.request.method).toBe('POST');
    reqPost.flush(newCourse);

    const reqAfterPost = httpController.expectOne(coursesUrl);
    expect(reqAfterPost.request.method).toBe('GET');
    reqAfterPost.flush([{ id: '1', name: 'Course 1', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [], comision: 1 }, newCourse]);
  });

  it('should delete a course by ID', () => {
    spyOn(enrollmentsService, 'deleteEnrollmentsByCourse').and.returnValue(of([]));

    service.deleteCourseById('1').subscribe((courses) => {
      expect(courses.length).toBe(0);
    });

    const reqDelete = httpController.expectOne(`${coursesUrl}/1`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});

    const reqAfterDelete = httpController.expectOne(coursesUrl);
    expect(reqAfterDelete.request.method).toBe('GET');
    reqAfterDelete.flush([]);
  });
});
