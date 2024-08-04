import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { EnrollmentsComponent } from './enrollments.component';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { CoursesService } from '../../../core/services/courses.service';
import { StudentsService } from '../../../core/services/students.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { Course } from '../../../shared/interfaces/course';
import { Student } from '../../../shared/interfaces/student';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { EnrollmentsRoutingModule } from './enrollments-routing.module';

xdescribe('EnrollmentsComponent', () => {
  let component: EnrollmentsComponent;
  let fixture: ComponentFixture<EnrollmentsComponent>;
  let enrollmentsService: jasmine.SpyObj<EnrollmentsService>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let studentsService: jasmine.SpyObj<StudentsService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const enrollmentsServiceSpy = jasmine.createSpyObj('EnrollmentsService', ['getEnrollments', 'addEnrollment', 'deleteEnrollment']);
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['getCourses']);
    const studentsServiceSpy = jasmine.createSpyObj('StudentsService', ['getStudents']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EnrollmentsComponent],
      imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        EnrollmentsRoutingModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule
      ],
      providers: [
        { provide: EnrollmentsService, useValue: enrollmentsServiceSpy },
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: StudentsService, useValue: studentsServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(EnrollmentsComponent);
    component = fixture.componentInstance;
    enrollmentsService = TestBed.inject(EnrollmentsService) as jasmine.SpyObj<EnrollmentsService>;
    coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
    studentsService = TestBed.inject(StudentsService) as jasmine.SpyObj<StudentsService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  
    const testEnrollments: Enrollment[] = [
      { id: '1', studentId: '1', courseId: '1' }
    ];
    const testCourses: Course[] = [
      { id: '1', comision: 1, name: 'Math', startDate: new Date(), endDate: new Date(), studentQuota: 30, enrolledStudents: [] }
    ];
    const testStudents: Student[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', DOB: new Date(), email: 'john.doe@example.com', enrolledCourses: [] }
    ];
  
    enrollmentsService.getEnrollments.and.returnValue(of(testEnrollments));
    coursesService.getCourses.and.returnValue(of(testCourses));
    studentsService.getStudents.and.returnValue(of(testStudents));
  
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(testEnrollments));
  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enrollments, courses, and students on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.enrollments.length).toBe(1);
    expect(component.courses.length).toBe(1);
    expect(component.students.length).toBe(1);
  }));

  it('should update data source correctly', () => {
    component.updateDataSource();
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].student).toBe('(1) John Doe');
    expect(component.dataSource[0].course).toBe('(1) Math');
  });

  it('should open the enrollment dialog and add enrollment', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);
    const mockEnrollment: Enrollment = { id: '2', studentId: '2', courseId: '2' };
    dialogRefSpy.afterClosed.and.returnValue(of(mockEnrollment));

    component.openAddEnrollmentDialog();
    expect(matDialog.open).toHaveBeenCalledWith(EnrollmentDialogComponent, {
      data: {
        courses$: component.courses$,
        students$: component.students$
      }
    });

    // Simulate dialog close
    dialogRefSpy.afterClosed().subscribe((result: Enrollment | undefined) => {
      if (result) {
        expect(enrollmentsService.addEnrollment).toHaveBeenCalledWith(result);
      }
    });
  });

  it('should delete enrollment by ID', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    enrollmentsService.deleteEnrollment.and.returnValue(of([]));
    
    component.deleteEnrollmentById('1');
    expect(window.confirm).toHaveBeenCalledWith('¿Está seguro que desea elminiar esta inscripción?');
    expect(enrollmentsService.deleteEnrollment).toHaveBeenCalledWith('1');
    expect(component.isLoading).toBeFalse();
  });
});
