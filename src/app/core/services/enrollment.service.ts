import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Enrollment } from '../../shared/interfaces/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  private enrollmentDatabase: Enrollment[] = [
    { id: 1, studentId: 1, courseId: 2 },
    { id: 2, studentId: 2, courseId: 3 },
    { id: 3, studentId: 8, courseId: 4 },
    { id: 4, studentId: 3, courseId: 5 },
    { id: 5, studentId: 4, courseId: 6 },
    { id: 6, studentId: 5, courseId: 7 },
    { id: 7, studentId: 6, courseId: 8 },
    { id: 8, studentId: 1, courseId: 3 },
    { id: 9, studentId: 2, courseId: 4 },
    { id: 10, studentId: 3, courseId: 6 },
    { id: 11, studentId: 4, courseId: 7 },
    { id: 12, studentId: 5, courseId: 8 },
    { id: 13, studentId: 7, courseId: 1 },
    { id: 14, studentId: 1, courseId: 5 },
    { id: 15, studentId: 2, courseId: 6 },
    { id: 16, studentId: 3, courseId: 8 },
    { id: 17, studentId: 4, courseId: 1 },
    { id: 18, studentId: 5, courseId: 2 },
    { id: 19, studentId: 6, courseId: 3 },
    { id: 20, studentId: 2, courseId: 7 },
    { id: 21, studentId: 8, courseId: 6 },
    { id: 22, studentId: 3, courseId: 2 },
    { id: 23, studentId: 7, courseId: 5 },
    { id: 24, studentId: 5, courseId: 4 },
    { id: 25, studentId: 8, courseId: 8 }
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
    const exists = this.enrollmentDatabase.some(enrollment =>
      enrollment.studentId === newEnrollment.studentId && enrollment.courseId === newEnrollment.courseId
    );

    if (exists) {
      alert('La inscripción ya existe.')
      return of(this.enrollmentDatabase).pipe(delay(400));
    } else {
      const newId = Math.max(...this.enrollmentDatabase.map(e => e.id)) + 1;
      this.enrollmentDatabase.push({
        id: newId,
        studentId: newEnrollment.studentId,
        courseId: newEnrollment.courseId
      });
      return of(this.enrollmentDatabase).pipe(delay(400));
    }
  }

  deleteEnrollment(id: number): Observable<Enrollment[]> {
    this.enrollmentDatabase = this.enrollmentDatabase.filter(enrollment => enrollment.id !== id);
    return of(this.enrollmentDatabase).pipe(delay(400));
  }

  deleteEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    this.enrollmentDatabase = this.enrollmentDatabase.filter(enrollment => enrollment.courseId !== courseId);
    return of(this.enrollmentDatabase).pipe(delay(400));
  }

  deleteEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    this.enrollmentDatabase = this.enrollmentDatabase.filter(enrollment => enrollment.studentId !== studentId);
    return of(this.enrollmentDatabase).pipe(delay(400));
  }
}