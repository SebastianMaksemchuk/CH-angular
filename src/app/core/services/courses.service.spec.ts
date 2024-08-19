import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { environment } from '../../../environments/environment';
import { Course } from '../../shared/interfaces/course';
import { Enrollment } from '../../shared/interfaces/enrollment';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  const coursesUrl = `${environment.apiUrl}courses`;
  const enrollmentsUrl = `${environment.apiUrl}enrollments`;

  let mockCourse: Course;
  let mockEnrollment: Enrollment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);

    mockCourse = {
      id: 'abcd',
      comision: 12345,
      name: 'Test Course',
      startDate: new Date(),
      endDate: new Date(),
    };

    mockEnrollment = {
      id: 'efgh',
      courseId: mockCourse.id,
      studentId: 'ijkl',
      enrollmentDate: new Date(),
      enrolledByUserId: 'wxyz'
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCourses', () => {
    it('should return an Observable of Courses with dates parsed', () => {
      const mockCourses: Course[] = [mockCourse];
      service.getCourses().subscribe(courses => {
        expect(courses.length).toBe(1);
        expect(courses[0].name).toBe(mockCourse.name);
        expect(courses[0].startDate instanceof Date).toBe(true);
        expect(courses[0].endDate instanceof Date).toBe(true);
      });

      const req = httpMock.expectOne(coursesUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourses);
    });
  });

  describe('#getCourseById', () => {
    it('should return a specific course by ID', () => {
      service.getCourseById(mockCourse.id).subscribe(course => {
        expect(course).toEqual(mockCourse);
      });

      const req = httpMock.expectOne(`${coursesUrl}/${mockCourse.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourse);
    });
  });

  describe('#createCourse', () => {
    it('should create a new course', () => {
      service.createCourse(mockCourse).subscribe(course => {
        expect(course).toEqual(mockCourse);
      });

      const req = httpMock.expectOne(coursesUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockCourse);
    });
  });

  describe('#editCourseById', () => {
    it('should update an existing course by ID', () => {
      service.editCourseById(mockCourse.id, mockCourse).subscribe(course => {
        expect(course).toEqual(mockCourse);
      });

      const req = httpMock.expectOne(`${coursesUrl}/${mockCourse.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockCourse);
    });
  });

  describe('#deleteCourseById', () => {
    it('should delete a course by ID and related enrollments', () => {
      service.deleteCourseById(mockCourse.id).subscribe(deletedCourse => {
        expect(deletedCourse).toEqual(mockCourse);
      });

      const deleteCourseReq = httpMock.expectOne(`${coursesUrl}/${mockCourse.id}`);
      expect(deleteCourseReq.request.method).toBe('DELETE');
      deleteCourseReq.flush(mockCourse);

      const enrollmentsReq = httpMock.expectOne(`${enrollmentsUrl}?courseId=${mockCourse.id}`);
      expect(enrollmentsReq.request.method).toBe('GET');
      enrollmentsReq.flush([mockEnrollment]);

      const deleteEnrollmentReq = httpMock.expectOne(`${enrollmentsUrl}/${mockEnrollment.id}`);
      expect(deleteEnrollmentReq.request.method).toBe('DELETE');
      deleteEnrollmentReq.flush({});
    });

    it('should delete a course even if no enrollments exist', () => {
      service.deleteCourseById(mockCourse.id).subscribe(deletedCourse => {
        expect(deletedCourse).toEqual(mockCourse);
      });

      const deleteCourseReq = httpMock.expectOne(`${coursesUrl}/${mockCourse.id}`);
      expect(deleteCourseReq.request.method).toBe('DELETE');
      deleteCourseReq.flush(mockCourse);

      const enrollmentsReq = httpMock.expectOne(`${enrollmentsUrl}?courseId=${mockCourse.id}`);
      expect(enrollmentsReq.request.method).toBe('GET');
      enrollmentsReq.flush([]);

      httpMock.expectNone(`${enrollmentsUrl}/1`);
    });
  });
});
