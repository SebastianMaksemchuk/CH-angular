import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentsService } from './students.service';
import { environment } from '../../../environments/environment';
import { Student } from '../../shared/interfaces/student';
import { Enrollment } from '../../shared/interfaces/enrollment';

describe('StudentsService', () => {
  let service: StudentsService;
  let httpMock: HttpTestingController;
  const studentsUrl = `${environment.apiUrl}students`;
  const enrollmentsUrl = `${environment.apiUrl}enrollments`;

  let mockStudent: Student;
  let mockEnrollment: Enrollment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentsService],
    });

    service = TestBed.inject(StudentsService);
    httpMock = TestBed.inject(HttpTestingController);

    mockStudent = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      DOB: new Date('2000-01-01'),
      email: 'john.doe@example.com',
    };

    mockEnrollment = {
      id: 'efgh',
      courseId: 'ijkl',
      studentId: mockStudent.id,
      enrollmentDate: new Date(),
      enrolledByUserId: 'wxyz'
    } 
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getStudents', () => {
    it('should return an Observable of Students', () => {
      const mockStudents: Student[] = [mockStudent];
      service.getStudents().subscribe(students => {
        expect(students.length).toBe(1);
        expect(students[0]).toEqual(mockStudent);
      });

      const req = httpMock.expectOne(studentsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });
  });

  describe('#getStudentById', () => {
    it('should return an Observable of a Student by ID', () => {
      service.getStudentById(mockStudent.id).subscribe(student => {
        expect(student).toEqual(mockStudent);
      });

      const req = httpMock.expectOne(`${studentsUrl}/${mockStudent.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
    });
  });

  describe('#createStudent', () => {
    it('should create a new student and return it', () => {
      service.createStudent(mockStudent).subscribe(student => {
        expect(student).toEqual(mockStudent);
      });

      const req = httpMock.expectOne(studentsUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockStudent);
    });
  });

  describe('#editStudentById', () => {
    it('should update a student by ID and return it', () => {
      service.editStudentById(mockStudent.id, mockStudent).subscribe(student => {
        expect(student).toEqual(mockStudent);
      });

      const req = httpMock.expectOne(`${studentsUrl}/${mockStudent.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockStudent);
    });
  });

  describe('#deleteStudentById', () => {
    it('should delete a student by ID and remove related enrollments', () => {
      service.deleteStudentById(mockStudent.id).subscribe(deletedStudent => {
        expect(deletedStudent).toEqual(mockStudent);
      });

      const deleteStudentReq = httpMock.expectOne(`${studentsUrl}/${mockStudent.id}`);
      expect(deleteStudentReq.request.method).toBe('DELETE');
      deleteStudentReq.flush(mockStudent);

      const deleteEnrollmentReq = httpMock.expectOne(`${enrollmentsUrl}?studentId=${mockStudent.id}`);
      expect(deleteEnrollmentReq.request.method).toBe('GET');
      deleteEnrollmentReq.flush([mockEnrollment]);

      const deleteEnrollmentByIdReq = httpMock.expectOne(`${enrollmentsUrl}/${mockEnrollment.id}`);
      expect(deleteEnrollmentByIdReq.request.method).toBe('DELETE');
      deleteEnrollmentByIdReq.flush({});
    });

    it('should delete a student even if no enrollments exist', () => {
      service.deleteStudentById(mockStudent.id).subscribe(deletedStudent => {
        expect(deletedStudent).toEqual(mockStudent);
      });

      const deleteStudentReq = httpMock.expectOne(`${studentsUrl}/${mockStudent.id}`);
      expect(deleteStudentReq.request.method).toBe('DELETE');
      deleteStudentReq.flush(mockStudent);

      const enrollmentsReq = httpMock.expectOne(`${enrollmentsUrl}?studentId=${mockStudent.id}`);
      expect(enrollmentsReq.request.method).toBe('GET');
      enrollmentsReq.flush([]);

      httpMock.expectNone(`${enrollmentsUrl}/1`);
    });
  });
});
