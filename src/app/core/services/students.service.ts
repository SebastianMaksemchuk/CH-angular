import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Student } from '../../shared/interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private studentsDatabase = [
    {
      id: 1,
      firstName: 'Sebastian',
      lastName: 'Maksemchuk',
      DOB: new Date('1990-01-28'),
      email: 'sebastian@netio.com.ar'
    },
    {
      id: 2,
      firstName: 'Alan',
      lastName: 'Netio',
      DOB: new Date('1990-07-10'),
      email: 'alan@netio.com.ar'
    },
    {
      id: 3,
      firstName: 'Mona',
      lastName: 'Jiménez',
      DOB: new Date('1951-01-11'),
      email: 'mona@jimenez.com.ar'
    },
    {
      id: 4,
      firstName: 'Damián Emiliano',
      lastName: 'Martínez',
      DOB: new Date('1992-03-08'),
      email: 'dibu@martinez.com.ar'
    }
  ]

  getStudents(): Observable<Student[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.studentsDatabase);
        observer.complete();
      }, 500);
    });
  }

  getStudentById(id: number): Observable<Student | undefined> {
    return this.getStudents().pipe(map((allStudents) => allStudents.find((el) => el.id === id)));
  }

  addStudent(student: Student): Observable<Student[]> {
    this.studentsDatabase.push(student);
    return this.getStudents();
  }

  deleteCourseById(id: number): Observable<Student[]> {
    this.studentsDatabase = this.studentsDatabase.filter((el) => el.id != id);
    return this.getStudents();
  }

}

