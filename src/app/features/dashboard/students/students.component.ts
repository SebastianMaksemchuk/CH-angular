import { Component } from '@angular/core';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../shared/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'DOB', 'details', 'edit', 'delete'];

  students: Student[] = [];
  students$: Observable<Student[]>;
  dataSource: Student[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService
  ) {
    this.students$ = this.studentsService.getStudents();
  }

  ngOnInit(): void {
    this.loadStudents()
  }

  loadStudents() {
    this.isLoading = true;
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.updateDataSource()
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateDataSource() {
    this.dataSource = this.students.map(student => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      DOB: student.DOB,
      email: student.email,
      enrolledCourses: []
    }));
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

  deleteStudentById(id: number) {
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