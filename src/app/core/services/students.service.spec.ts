import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentsService } from './students.service';
import { EnrollmentsService } from './enrollments.service';
import { environment } from '../../../environments/environment';
import { Student } from '../../shared/interfaces/student';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('StudentsService', () => {
  let service: StudentsService;
  let httpController: HttpTestingController;
  let enrollmentsService: EnrollmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentsService, MockProvider(EnrollmentsService)],
    });

    service = TestBed.inject(StudentsService);
    httpController = TestBed.inject(HttpTestingController);
    enrollmentsService = TestBed.inject(EnrollmentsService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should retrieve all students', () => {
    const mockStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
    ];

    service.getStudents().subscribe(students => {
      expect(students.length).toBe(2);
      expect(students[0].firstName).toBe('John');
      expect(students[1].DOB).toEqual(new Date('1999-05-15'));
    });

    const req = httpController.expectOne(`${environment.apiUrl}students`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should retrieve a student by ID', () => {
    const mockStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
    ];

    service.getStudentById('1').subscribe(student => {
      expect(student).toBeDefined();
      expect(student?.firstName).toBe('John');
    });

    const req = httpController.expectOne(`${environment.apiUrl}students`);
    req.flush(mockStudents);
  });

  it('should add a new student', () => {
    const mockStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
    ];

    const newStudent: Student = { id: '', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] };

    service.addStudent(newStudent).subscribe(students => {
      expect(students.length).toBe(2);
      expect(students[1].firstName).toBe('Jane');
    });

    const getReq = httpController.expectOne(`${environment.apiUrl}students`);
    getReq.flush(mockStudents);

    const postReq = httpController.expectOne(`${environment.apiUrl}students`);
    postReq.flush({ ...newStudent, id: '2' });

    const finalGetReq = httpController.expectOne(`${environment.apiUrl}students`);
    finalGetReq.flush([...mockStudents, { ...newStudent, id: '2' }]);
  });

  // it('should delete a student by ID', () => {
  //   const mockStudents: Student[] = [
  //     { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
  //     { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
  //   ];

  //   spyOn(enrollmentsService, 'deleteEnrollmentsByStudent').and.returnValue(of([]));

  //   service.deleteStudentById('1').subscribe(students => {
  //     expect(students.length).toBe(1);
  //     expect(students[0].firstName).toBe('Jane');
  //   });

  //   const deleteEnrollmentsReq = httpController.expectOne(`${environment.apiUrl}students/1`);
  //   deleteEnrollmentsReq.flush(null);

  //   const deleteReq = httpController.expectOne(`${environment.apiUrl}students/1`);
  //   deleteReq.flush(null);

  //   const getReq = httpController.expectOne(`${environment.apiUrl}students`);
  //   getReq.flush([mockStudents[1]]);
  // });
});
