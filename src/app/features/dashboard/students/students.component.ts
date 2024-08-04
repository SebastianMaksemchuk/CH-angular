import { Component } from '@angular/core';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../shared/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';
import { forkJoin, Observable } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { EnrollmentsService } from '../../../core/services/enrollments.service';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'enrolledCoursesCount', 'details', 'edit', 'delete'];

  students: Student[] = [];
  enrollments: Enrollment[] = [];
  students$: Observable<Student[]>;
  enrollments$: Observable<Enrollment[]>;
  dataSource: any[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService
  ) {
    this.students$ = this.studentsService.getStudents();
    this.enrollments$ = this.enrollmentsService.getEnrollments();
  }

  ngOnInit(): void {
    this.loadStudents()
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
      this.isLoading = true;
      this.studentsService.deleteStudentById(id).subscribe({
        next: (updatedStudents) => {
          this.students = updatedStudents;
          this.updateDataSource();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}