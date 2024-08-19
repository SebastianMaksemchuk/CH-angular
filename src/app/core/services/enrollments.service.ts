import { Injectable } from '@angular/core';
import { concatMap, Observable, of } from 'rxjs';
import { Enrollment } from '../../shared/interfaces/enrollment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  private enrollmentsUrl: string = environment.apiUrl + 'enrollments';

  constructor(
    private httpClient: HttpClient
  ) { }

  getEnrollments(): Observable<Enrollment[]> {
    return this.httpClient.get<Enrollment[]>(`${this.enrollmentsUrl}?_embed=student&_embed=course`)
  }

  createEnrollment(payload: Enrollment): Observable<Enrollment> {
    return this.getEnrollments().pipe(
      concatMap((enrollments) => {
        const existingEnrollment = enrollments.find(enrollment => 
          enrollment.studentId === payload.studentId && enrollment.courseId === payload.courseId
        );

        if (existingEnrollment) {
          alert('Ya existe la inscripción.');
          return of(existingEnrollment);
        } else {
          const { id, ...enrollment } = payload;
          return this.httpClient.post<Enrollment>(this.enrollmentsUrl, enrollment).pipe(
            concatMap((newEnrollment) => this.httpClient.get<Enrollment>(`${this.enrollmentsUrl}/${newEnrollment.id}?_embed=student&_embed=course`))
          );
        }
      })
    );
  }

  deleteEnrollmentById(id: string): Observable<Enrollment> {
    return this.httpClient.delete<Enrollment>(`${this.enrollmentsUrl}/${id}`);
  }
  
}