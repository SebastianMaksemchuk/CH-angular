import { Component } from '@angular/core';
import { Student } from '../../global/interfaces/students';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent {
  idIndex: number = 0;
  displayedColumns: string[] = ['id', 'name', 'email', 'DOB', 'details', 'edit', 'delete'];
  dataSource: Student[] = []

  constructor(private matDialog: MatDialog) {
    this.dataSource = [
      {
        id: ++this.idIndex,
        firstName: 'Sebastian',
        lastName: 'Maksemchuk',
        DOB: new Date(1990, 0, 28),
        email: 'sebastian@netio.com.ar'
      },
      {
        id: ++this.idIndex,
        firstName: 'Sebastian',
        lastName: 'Maksemchuk',
        DOB: new Date(1990, 0, 28),
        email: 'sebastian@netio.com.ar'
      },
      {
        id: ++this.idIndex,
        firstName: 'Sebastian',
        lastName: 'Maksemchuk',
        DOB: new Date(1990, 0, 28),
        email: 'sebastian@netio.com.ar'
      }
    ];
    this.idIndex = this.dataSource.length;
  }

  newStudent(): void {
    this.matDialog
    .open(StudentDialogComponent)
    .afterClosed()
    .subscribe({
      next: (value) => {
        console.log(value)
        value['id'] = ++this.idIndex
        this.dataSource = [...this.dataSource, value]
      }
    })
  }

  editStudent(student: Student) {
    this.matDialog
    .open(StudentDialogComponent, { data: student })
    .afterClosed()
    .subscribe({
      next: (value) => {
        if (!!value) {
          this.dataSource = this.dataSource.map((el)=>el.id === student.id ? value : el)
        }
      }
    });
  }
}