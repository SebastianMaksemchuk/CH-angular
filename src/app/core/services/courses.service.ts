import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Course } from '../../shared/interfaces/course';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Enrollment } from '../../shared/interfaces/enrollment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesUrl: string = environment.apiUrl + 'courses';
  private enrollmentsUrl: string = environment.apiUrl + 'enrollments';

  constructor(
    private httpClient: HttpClient
  ) { }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.coursesUrl).pipe(
      map(courses => courses.map(course => ({
        ...course,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate)
      }))));
  }

  getCourseById(id: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.coursesUrl}/${id}`)
  }

  createCourse(payload: Course): Observable<Course> {
    const { id, ...course } = payload;
    return this.httpClient.post<Course>(this.coursesUrl, course)
  }

  editCourseById(id: string, editedCourse: Course): Observable<Course> {
    return this.httpClient.put<Course>(`${this.coursesUrl}/${id}`, editedCourse)
  }

  deleteCourseById(id: string): Observable<Course> {
    return this.httpClient.delete<Course>(`${this.coursesUrl}/${id}`).pipe(
      switchMap(deletedCourse => {
        return this.httpClient.get<Enrollment[]>(`${this.enrollmentsUrl}?courseId=${id}`).pipe(
          switchMap(enrollments => {
            if (enrollments.length === 0) {
              return of(deletedCourse);
            }
            const deleteRequests = enrollments.map(enrollment =>
              this.httpClient.delete(`${this.enrollmentsUrl}/${enrollment.id}`)
            );
            return forkJoin(deleteRequests).pipe(
              map(() => deletedCourse)
            )
          })
        )
      })
    )
  }

}