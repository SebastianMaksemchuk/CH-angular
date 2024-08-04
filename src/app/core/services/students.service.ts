import { Injectable } from '@angular/core';
import { concatMap, delay, map, Observable, switchMap } from 'rxjs';
import { Student } from '../../shared/interfaces/student';
import { EnrollmentsService } from './enrollments.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private studentsUrl: string = environment.apiUrl + 'students';

  constructor(private enrollmentsService: EnrollmentsService, private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.studentsUrl).pipe(
      map(courses => courses.map(course => ({
        ...course,
        DOB: new Date(course.DOB),
      }))));
  }

  getStudentById(id: string): Observable<Student | undefined> {
    return this.getStudents().pipe(map((allStudents) => allStudents.find((el) => el.id === id)));
  }

  addStudent(newStudent: Student): Observable<Student[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.getStudents().pipe(
      map(students => {
        const maxId = students.length > 0 ? Math.max(...students.map(student => parseInt(student.id))) : 0;
        newStudent.id = (maxId + 1).toString();
        return newStudent;
      }),
      switchMap(studentWithId => 
        this.httpClient.post<Student>(this.studentsUrl, studentWithId, { headers })
      ),
      switchMap(() => this.getStudents())
    );
  }

  deleteStudentById(id: string): Observable<Student[]> {
    return this.enrollmentsService.deleteEnrollmentsByStudent(id).pipe(
      concatMap(() => this.httpClient.delete(`${this.studentsUrl}/${id}`)),
      switchMap(() => this.getStudents())
    );
  }

}

