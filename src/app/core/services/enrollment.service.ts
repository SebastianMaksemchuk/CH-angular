import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Enrollment } from '../../shared/interfaces/enrollment';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  private enrollmentDatabase: Enrollment[] = [
    {
      studentId: 1,
      courseId: 1,
    },
    {
      studentId: 1,
      courseId: 2,
    },
    {
      studentId: 4,
      courseId: 3,
    },
  ];

  getEnrollments(): Observable<Enrollment[]> {
    return of<Enrollment[]>(this.enrollmentDatabase).pipe(delay(400));
  }

  addEnrollment(): Observable<Enrollment[]> {
    this.enrollmentDatabase.push({
      studentId: 2,
      courseId: 2,
    });
    return this.getEnrollments();
  }
}