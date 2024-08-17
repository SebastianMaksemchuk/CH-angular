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
    return this.httpClient.delete<Student>(`${this.studentsUrl}/${id}`)
  }

}

