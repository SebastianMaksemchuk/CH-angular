import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { StudentsComponent } from './students.component';
import { StudentsService } from '../../../core/services/students.service';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { Student } from '../../../shared/interfaces/student';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

xdescribe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let studentsService: StudentsService;
  let enrollmentsService: EnrollmentsService;
  let httpController: HttpTestingController;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StudentsComponent, StudentDialogComponent],
      providers: [
        MockProvider(StudentsService),
        MockProvider(EnrollmentsService),
        MockProvider(MatDialog),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    studentsService = TestBed.inject(StudentsService);
    enrollmentsService = TestBed.inject(EnrollmentsService);
    httpController = TestBed.inject(HttpTestingController);
    matDialog = TestBed.inject(MatDialog);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should load students and enrollments on init', () => {
    const mockStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
    ];
    const mockEnrollments: Enrollment[] = [
      { id: "1", studentId: '1', courseId: 'course1' }
    ];

    spyOn(studentsService, 'getStudents').and.returnValue(of(mockStudents));
    spyOn(enrollmentsService, 'getEnrollments').and.returnValue(of(mockEnrollments));

    fixture.detectChanges();

    expect(component.students).toEqual(mockStudents);
    expect(component.enrollments).toEqual(mockEnrollments);
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].enrolledCoursesCount).toBe(1);
  });

  it('should add a new student', () => {
    const newStudent: Student = { id: '3', firstName: 'Mark', lastName: 'Brown', DOB: new Date('1998-08-10'), email: 'mark@example.com', enrolledCourses: [] };
    const updatedStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] },
      newStudent
    ];

    spyOn(studentsService, 'addStudent').and.returnValue(of(updatedStudents));
    spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(newStudent) } as any);

    component.newStudent();
    fixture.detectChanges();

    expect(studentsService.addStudent).toHaveBeenCalledWith(newStudent);
    expect(component.students).toEqual(updatedStudents);
    expect(component.dataSource.length).toBe(3);
  });

  it('should edit a student', () => {
    const studentToEdit: Student = { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] };
    const editedStudent: Student = { ...studentToEdit, firstName: 'Johnny' };
    const updatedStudents: Student[] = [editedStudent, { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] }];

    spyOn(studentsService, 'addStudent').and.returnValue(of(updatedStudents));
    spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(editedStudent) } as any);

    component.editStudent(studentToEdit);
    fixture.detectChanges();

    expect(component.students).toEqual(updatedStudents);
    expect(component.dataSource[0].firstName).toBe('Johnny');
  });

  it('should delete a student by ID', () => {
    const studentsBeforeDeletion: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date('2000-01-01'), email: 'john@example.com', enrolledCourses: [] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] }
    ];
    const studentsAfterDeletion: Student[] = [
      { id: '2', firstName: 'Jane', lastName: 'Smith', DOB: new Date('1999-05-15'), email: 'jane@example.com', enrolledCourses: [] }
    ];

    spyOn(studentsService, 'deleteStudentById').and.returnValue(of(studentsAfterDeletion));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteStudentById('1');
    fixture.detectChanges();

    expect(studentsService.deleteStudentById).toHaveBeenCalledWith('1');
    expect(component.students).toEqual(studentsAfterDeletion);
    expect(component.dataSource.length).toBe(1);
  });
});
