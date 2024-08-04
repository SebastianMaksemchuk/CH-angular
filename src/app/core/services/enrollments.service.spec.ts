import { TestBed } from '@angular/core/testing';
import { EnrollmentsService } from './enrollments.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Enrollment } from '../../shared/interfaces/enrollment';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let httpController: HttpTestingController;

  const enrollmentsUrl = environment.apiUrl + 'enrollments';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnrollmentsService],
    });
    service = TestBed.inject(EnrollmentsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch enrollments', () => {
    const mockEnrollments: Enrollment[] = [
      { id: '1', studentId: '1', courseId: '1' },
    ];

    service.getEnrollments().subscribe((enrollments) => {
      expect(enrollments).toEqual(mockEnrollments);
    });

    const req = httpController.expectOne(enrollmentsUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEnrollments);
  });

  it('should fetch enrollment by ID', () => {
    const mockEnrollment: Enrollment = { id: '1', studentId: '1', courseId: '1' };

    service.getEnrollmentById('1').subscribe((enrollment) => {
      expect(enrollment).toEqual(mockEnrollment);
    });

    const req = httpController.expectOne(enrollmentsUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockEnrollment]);
  });

  it('should add a new enrollment', () => {
    const newEnrollment: Enrollment = { id: '2', studentId: '2', courseId: '2' };

    service.addEnrollment(newEnrollment).subscribe((enrollments) => {
      expect(enrollments).toContain(newEnrollment);
    });

    const req = httpController.expectOne(enrollmentsUrl);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', studentId: '1', courseId: '1' }]);

    const reqPost = httpController.expectOne(enrollmentsUrl);
    expect(reqPost.request.method).toBe('POST');
    reqPost.flush(newEnrollment);

    const reqAfterPost = httpController.expectOne(enrollmentsUrl);
    expect(reqAfterPost.request.method).toBe('GET');
    reqAfterPost.flush([{ id: '1', studentId: '1', courseId: '1' }, newEnrollment]);
  });

  it('should delete an enrollment by ID', () => {
    service.deleteEnrollment('1').subscribe((enrollments) => {
      expect(enrollments.length).toBe(0);
    });

    const reqDelete = httpController.expectOne(`${enrollmentsUrl}/1`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});

    const reqAfterDelete = httpController.expectOne(enrollmentsUrl);
    expect(reqAfterDelete.request.method).toBe('GET');
    reqAfterDelete.flush([]);
  });

  it('should delete enrollments by course', () => {
    service.deleteEnrollmentsByCourse('1').subscribe((enrollments) => {
      expect(enrollments.length).toBe(0);
    });

    const reqGetByCourse = httpController.expectOne(enrollmentsUrl);
    expect(reqGetByCourse.request.method).toBe('GET');
    reqGetByCourse.flush([{ id: '1', studentId: '1', courseId: '1' }]);

    const reqDelete = httpController.expectOne(`${enrollmentsUrl}/1`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});

    const reqAfterDelete = httpController.expectOne(enrollmentsUrl);
    expect(reqAfterDelete.request.method).toBe('GET');
    reqAfterDelete.flush([]);
  });

  it('should delete enrollments by student', () => {
    service.deleteEnrollmentsByStudent('1').subscribe((enrollments) => {
      expect(enrollments.length).toBe(0);
    });

    const reqGetByStudent = httpController.expectOne(enrollmentsUrl);
    expect(reqGetByStudent.request.method).toBe('GET');
    reqGetByStudent.flush([{ id: '1', studentId: '1', courseId: '1' }]);

    const reqDelete = httpController.expectOne(`${enrollmentsUrl}/1`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});

    const reqAfterDelete = httpController.expectOne(enrollmentsUrl);
    expect(reqAfterDelete.request.method).toBe('GET');
    reqAfterDelete.flush([]);
  });
});
