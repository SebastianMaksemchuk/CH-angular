import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { Student } from '../../shared/interfaces/student';
import { EnrollmentsService } from './enrollment.service';

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
      email: 'sebastian@netio.com.ar',
      enrolledCourses: []
    },
    {
      id: 2,
      firstName: 'Alan',
      lastName: 'Netio',
      DOB: new Date('1990-07-10'),
      email: 'alan@netio.com.ar',
      enrolledCourses: []
    },
    {
      id: 3,
      firstName: 'Mona',
      lastName: 'Jiménez',
      DOB: new Date('1951-01-11'),
      email: 'mona@jimenez.com.ar',
      enrolledCourses: []
    },
    {
      id: 4,
      firstName: 'Damián Emiliano',
      lastName: 'Martínez',
      DOB: new Date('1992-03-08'),
      email: 'dibu@martinez.com.ar',
      enrolledCourses: []
    },
    {
      id: 5,
      firstName: 'Lionel',
      lastName: 'Messi',
      DOB: new Date('1987-06-24'),
      email: 'lio@messi.com.ar',
      enrolledCourses: []
    },
    {
      id: 6,
      firstName: 'Ángel',
      lastName: 'Di María',
      DOB: new Date('1988-02-14'),
      email: 'fideo@dimaria.com.ar',
      enrolledCourses: []
    },
    {
      id: 7,
      firstName: 'Julián',
      lastName: 'Álvarez',
      DOB: new Date('2000-01-31'),
      email: 'julian@alvarez.com.ar',
      enrolledCourses: []
    },
    {
      id: 8,
      firstName: 'Enzo',
      lastName: 'Fernández',
      DOB: new Date('2001-07-17'),
      email: 'enzo@fernandez.com.ar',
      enrolledCourses: []
    }
  ]

  constructor(private enrollmentsService: EnrollmentsService) { }

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

  addStudent(newStudent: Student): Observable<Student[]> {
    const newId = Math.max(...this.studentsDatabase.map(e => e.id)) + 1;
    this.studentsDatabase.push(
      {
        id: newId,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        DOB: newStudent.DOB,
        email: newStudent.email,
        enrolledCourses: []
      }
    );
    return this.getStudents();
  }

  deleteStudentById(id: number): Observable<Student[]> {
    this.studentsDatabase = this.studentsDatabase.filter((el) => el.id != id);
    this.enrollmentsService.deleteEnrollmentsByStudent(id).subscribe();
    return this.getStudents().pipe(delay(400));
  }

}

