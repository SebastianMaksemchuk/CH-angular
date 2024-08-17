import { Injectable } from '@angular/core';
import { concatMap, delay, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Enrollment } from '../../shared/interfaces/enrollment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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



  // getEnrollmentById(id: string): Observable<Enrollment | undefined> {
  //   return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.find((el) => el.id === id)));
  // }

  // getEnrollmentsByCourse(courseId: string): Observable<Enrollment[] | undefined> {
  //   return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.filter((el) => el.courseId === courseId)));
  // }

  // getEnrollmentsByStudent(studentId: string): Observable<Enrollment[] | undefined> {
  //   return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.filter((el) => el.studentId === studentId)));
  // }

  // addEnrollment(newEnrollment: { id: string, studentId: string, courseId: string }): Observable<Enrollment[]> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   const exists = this.enrollmentDatabase.some(enrollment =>
  //     enrollment.studentId === newEnrollment.studentId && enrollment.courseId === newEnrollment.courseId
  //   );
  //   return this.getEnrollments().pipe(
  //     switchMap(enrollments => {
  //       const exists = enrollments.some(enrollment =>
  //         enrollment.studentId === newEnrollment.studentId && enrollment.courseId === newEnrollment.courseId
  //       );

  //       if (exists) {
  //         alert('La inscripción ya existe.')
  //         return this.getEnrollments();
  //       } else {
  //         const maxId = enrollments.length > 0 ? Math.max(...enrollments.map(enrollment => parseInt(enrollment.id))) : 0;
  //         newEnrollment.id = (maxId + 1).toString();
  //         return this.httpClient.post<Enrollment>(this.enrollmentsUrl, newEnrollment, { headers }).pipe(
  //           switchMap(() => this.getEnrollments())
  //         );
  //       }
  //     })
  //   );
  // }



  // deleteEnrollmentsByCourse(courseId: string): Observable<Enrollment[]> {
  //   return this.getEnrollmentsByCourse(courseId).pipe(
  //     switchMap(enrollments => {
  //       if (enrollments && enrollments.length > 0) {
  //         const deleteRequests = enrollments.map(enrollment =>
  //           this.httpClient.delete(`${this.enrollmentsUrl}/${enrollment.id}`)
  //         );
  //         return forkJoin(deleteRequests).pipe(
  //           switchMap(() => this.getEnrollments())
  //         );
  //       } else {
  //         return this.getEnrollments();
  //       }
  //     })
  //   );
  // }

  // deleteEnrollmentsByStudent(studentId: string): Observable<Enrollment[]> {
  //   return this.getEnrollmentsByStudent(studentId).pipe(
  //     switchMap(enrollments => {
  //       if (enrollments && enrollments.length > 0) {
  //         const deleteRequests = enrollments.map(enrollment =>
  //           this.httpClient.delete(`${this.enrollmentsUrl}/${enrollment.id}`)
  //         );
  //         return forkJoin(deleteRequests).pipe(
  //           switchMap(() => this.getEnrollments())
  //         );
  //       } else {
  //         return this.getEnrollments();
  //       }
  //     })
  //   );
  // }
}