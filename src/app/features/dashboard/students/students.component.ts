import { Component, OnDestroy, OnInit } from '@angular/core';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../shared/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';
import { forkJoin, Observable } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { Store } from '@ngrx/store';
import { StudentsActions } from './store/students.actions';
import { selectStudents, selectStudentsError, selectStudentsIsLoading } from './store/students.selectors';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['id', 'name', 'email', 'enrolledCoursesCount', 'details', 'edit', 'delete'];
  
  students$: Observable<Student[]>;
  isLoading$: Observable<boolean>;
  error$:Observable<any>
  
  students: Student[] = [];
  enrollments: Enrollment[] = [];
  enrollments$: Observable<Enrollment[]>;
  dataSource: any[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
    private store: Store
  ) {
    this.students$ = this.store.select(selectStudents);
    this.isLoading$ = this.store.select(selectStudentsIsLoading);
    this.error$ = this.store.select(selectStudentsError);

    this.enrollments$ = this.enrollmentsService.getEnrollments();
  }


  ngOnInit(): void {
    // this.loadStudents()
    this.store.dispatch(StudentsActions.loadStudents())
  }

  ngOnDestroy(): void {
    this.store.dispatch(StudentsActions.unsetStudentsStore())
  }

  reloadPage() {
    location.reload()
  }
  
  loadStudents() {
    this.isLoading = true;
    forkJoin([this.students$, this.enrollments$]).subscribe({
      next: ([students, enrollments]) => {
        this.students = students;
        this.enrollments = enrollments;
        this.updateDataSource();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateDataSource() {
    this.dataSource = this.students.map(student => {
      const enrolledCoursesCount = this.enrollments.filter(enrollment => enrollment.studentId === student.id).length;
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        enrolledCoursesCount: enrolledCoursesCount
      };
    });
  }

  newStudent(): void {
    this.matDialog
      .open(StudentDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.studentsService.addStudent(result).subscribe({
            next: (updatedStudents) => {
              this.students = updatedStudents;
              this.updateDataSource();
            }
          })
        }
      }
      );
  };

  editStudent(student: Student) {
    this.matDialog
      .open(StudentDialogComponent, { data: student })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (!!value) {
            this.students = this.students.map((el) => el.id === student.id ? value : el);
            this.updateDataSource()
          };
        }
      });
  };

  deleteStudentById(id: string) {
    if (confirm('¿Está seguro que desea elminiar este alumno?')) {
      this.store.dispatch(StudentsActions.deleteStudent({id: id}))
    }
  }
}