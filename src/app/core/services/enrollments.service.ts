import { Injectable } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
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
    const { id, ...enrollment } = payload;
    return this.httpClient.post<Enrollment>(this.enrollmentsUrl, enrollment).pipe(
      concatMap((enrollment) => this.httpClient.get<Enrollment>(`${this.enrollmentsUrl}/${enrollment.id}?_embed=student&_embed=course`))
    )
  }

  deleteEnrollmentById(id: string): Observable<Enrollment> {
    return this.httpClient.delete<Enrollment>(`${this.enrollmentsUrl}/${id}`);
  }
  
}