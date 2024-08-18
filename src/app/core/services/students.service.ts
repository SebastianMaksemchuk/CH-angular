import { Injectable } from '@angular/core';
import { concatMap, delay, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Student } from '../../shared/interfaces/student';
import { EnrollmentsService } from './enrollments.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Enrollment } from '../../shared/interfaces/enrollment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private studentsUrl: string = environment.apiUrl + 'students';
  private enrollmentsUrl: string = environment.apiUrl + 'enrollments';

  constructor(
    private httpClient: HttpClient
  ) { }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.studentsUrl).pipe(
      map(students => students.map(student => ({
        ...student,
        DOB: new Date(student.DOB),
      }))));
  }

  getStudentById(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.studentsUrl}/${id}`)
  }

  createStudent(payload: Student): Observable<Student> {
    const { id, ...student } = payload;
    return this.httpClient.post<Student>(this.studentsUrl, student);
  }

  editStudentById(id: string, editedStudent: Student): Observable<Student> {
    return this.httpClient.put<Student>(`${this.studentsUrl}/${id}`, editedStudent)
  }

  deleteStudentById(id: string): Observable<Student> {
    return this.httpClient.delete<Student>(`${this.studentsUrl}/${id}`).pipe(
      switchMap(deletedStudent => {
        return this.httpClient.get<Enrollment[]>(`${this.enrollmentsUrl}?studentId=${id}`).pipe(
          switchMap(enrollments => {
            const deleteRequests = enrollments.map(enrollment =>
              this.httpClient.delete(`${this.enrollmentsUrl}/${enrollment.id}`)
            );
            return forkJoin(deleteRequests).pipe(
              map(() => deletedStudent)
            )
          })
        )
      })
    )
  }

}

