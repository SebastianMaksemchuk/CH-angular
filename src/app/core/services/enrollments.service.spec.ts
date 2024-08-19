import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnrollmentsService } from './enrollments.service';
import { environment } from '../../../environments/environment';
import { Enrollment } from '../../shared/interfaces/enrollment';
import { of } from 'rxjs';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let httpMock: HttpTestingController;
  const enrollmentsUrl = `${environment.apiUrl}enrollments`;

  let mockEnrollment: Enrollment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnrollmentsService],
    });

    service = TestBed.inject(EnrollmentsService);
    httpMock = TestBed.inject(HttpTestingController);

    mockEnrollment = {
      id: 'abcd',
      courseId: 'fghi',
      studentId: 'ejkl',
      enrollmentDate: new Date(),
      enrolledByUserId: 'wxyz'
    };

    spyOn(window, 'alert');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getEnrollments', () => {
    it('should return an Observable of Enrollments with embedded course and student', () => {
      const mockEnrollments: Enrollment[] = [mockEnrollment];
      service.getEnrollments().subscribe(enrollments => {
        expect(enrollments.length).toBe(1);
        expect(enrollments[0]).toEqual(mockEnrollment);
      });

      const req = httpMock.expectOne(`${enrollmentsUrl}?_embed=student&_embed=course`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEnrollments);
    });
  });

  describe('#createEnrollment', () => {
    it('should return existing enrollment if already exists', () => {
      const mockEnrollments: Enrollment[] = [mockEnrollment];
      spyOn(service, 'getEnrollments').and.returnValue(of(mockEnrollments));

      service.createEnrollment(mockEnrollment).subscribe(enrollment => {
        expect(enrollment).toEqual(mockEnrollment);
        expect(window.alert).toHaveBeenCalledWith('Ya existe la inscripción.');
      });
      expect(service.getEnrollments).toHaveBeenCalled();
    });

    it('should create a new enrollment and return it', () => {
      const mockEnrollments: Enrollment[] = [];
      spyOn(service, 'getEnrollments').and.returnValue(of(mockEnrollments));

      service.createEnrollment(mockEnrollment).subscribe(enrollment => {
        expect(enrollment).toEqual(mockEnrollment);
      });

      const postReq = httpMock.expectOne(enrollmentsUrl);
      expect(postReq.request.method).toBe('POST');
      postReq.flush(mockEnrollment);

      const getReq = httpMock.expectOne(`${enrollmentsUrl}/${mockEnrollment.id}?_embed=student&_embed=course`);
      expect(getReq.request.method).toBe('GET');
      getReq.flush(mockEnrollment);
    });
  });

  describe('#deleteEnrollmentById', () => {
    it('should delete an enrollment by ID and return it', () => {
      service.deleteEnrollmentById(mockEnrollment.id).subscribe(deletedEnrollment => {
        expect(deletedEnrollment).toEqual(mockEnrollment);
      });

      const req = httpMock.expectOne(`${enrollmentsUrl}/${mockEnrollment.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockEnrollment);
    });
  });
});
