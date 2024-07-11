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
  dataSource: Student[] = []
  displayedColumns: string[] = ['id', 'name', 'email', 'DOB', 'details', 'edit', 'delete'];
  idIndex: number = 0;
  constructor(private matDialog: MatDialog) {
    this.dataSource = [
      {
        id: ++this.idIndex,
        firstName: 'Sebastian',
        lastName: 'Maksemchuk',
        DOB: new Date('1990-01-28'),
        email: 'sebastian@netio.com.ar'
      },
      {
        id: ++this.idIndex,
        firstName: 'Alan',
        lastName: 'Netio',
        DOB: new Date('1990-07-10'),
        email: 'alan@netio.com.ar'
      },
      {
        id: ++this.idIndex,
        firstName: 'Mona',
        lastName: 'Jiménez',
        DOB: new Date('1951-01-11'),
        email: 'mona@jimenez.com.ar'
      },
      {
        id: ++this.idIndex,
        firstName: 'Damián Emiliano',
        lastName: 'Martínez',
        DOB: new Date('1992-03-08'),
        email: 'dibu@martinez.com.ar'
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
        if (value['email']) {
          value['id'] = ++this.idIndex
          value['subscribedStudents'] = []
          this.dataSource = [...this.dataSource, value]
        }
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

  deleteStudentById(id: string | number) {
    this.dataSource = this.dataSource.filter(el => el.id != id)
  }
}