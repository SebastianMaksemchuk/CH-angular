import { Component } from '@angular/core';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../shared/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'DOB', 'details', 'edit', 'delete'];
  dataSource: Student[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService) {
  }

  ngOnInit(): void {
    this.loadStudents()
  }

  loadStudents() {
    this.isLoading = true;
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.dataSource = students;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  newStudent(): void {
    this.matDialog
      .open(StudentDialogComponent)
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value['email']) {
            value['id'] = this.dataSource.length + 1;
            value['enrolledStudents'] = [];
            this.dataSource = [...this.dataSource, value];
          };
        }
      });
  };

  editStudent(student: Student) {
    this.matDialog
      .open(StudentDialogComponent, { data: student })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (!!value) {
            this.dataSource = this.dataSource.map((el) => el.id === student.id ? value : el)
          };
        }
      });
  };

  deleteStudentById(id: string | number) {
    if (confirm('¿Está seguro que desea elminiar este curso?')) {
      this.dataSource = this.dataSource.filter(el => el.id != id);
    }
  };
};