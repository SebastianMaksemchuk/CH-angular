import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Enrollment } from '../../shared/interfaces/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  private enrollmentDatabase: Enrollment[] = [
    {
      id: 1,
      studentId: 1,
      courseId: 1,
    },
    {
      id: 2,
      studentId: 1,
      courseId: 2,
    },
    {
      id: 3,
      studentId: 4,
      courseId: 3,
    },
  ];

  getEnrollments(): Observable<Enrollment[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.enrollmentDatabase);
        observer.complete();
      }, 400)
    })
  }

  getEnrollmentById(id: number): Observable<Enrollment | undefined> {
    return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.find((el) => el.id === id)));
  }

  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[] | undefined> {
    return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.filter((el) => el.courseId === courseId)));
  }

  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[] | undefined> {
    return this.getEnrollments().pipe(map((allEnrollments) => allEnrollments.filter((el) => el.studentId === studentId)));
  }

  addEnrollment(newEnrollment: { studentId: number, courseId: number }): Observable<Enrollment[]> {
    const newId = Math.max(...this.enrollmentDatabase.map(e => e.id)) + 1;
    this.enrollmentDatabase.push({
      id: newId,
      studentId: newEnrollment.studentId,
      courseId: newEnrollment.courseId
    });
    return of(this.enrollmentDatabase).pipe(delay(400));
  }

  deleteEnrollment(id: number): Observable<Enrollment[]> {
    this.enrollmentDatabase = this.enrollmentDatabase.filter(enrollment => enrollment.id !== id);
    return of(this.enrollmentDatabase).pipe(delay(400));
  }
}