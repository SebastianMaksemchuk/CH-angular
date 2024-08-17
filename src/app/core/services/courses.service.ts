import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Course } from '../../shared/interfaces/course';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesUrl: string = environment.apiUrl + 'courses';

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
    // return this..deleteEnrollmentsByCourse(id).pipe(
    //   concatMap(() => this.httpClient.delete(`${this.coursesUrl}/${id}`)),
    //   switchMap(() => this.getCourses())
    // );
    return this.httpClient.delete<Course>(`${this.coursesUrl}/${id}`)
  }

}

