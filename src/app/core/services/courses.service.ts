import { Injectable } from '@angular/core';
import { concatMap, delay, map, Observable, switchMap } from 'rxjs';
import { Course } from '../../shared/interfaces/course';
import { EnrollmentsService } from './enrollments.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesUrl: string = environment.apiUrl + 'courses';

  constructor(private enrollmentsService: EnrollmentsService, private httpClient: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.coursesUrl).pipe(
      map(courses => courses.map(course => ({
        ...course,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate)
      })))
    );
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.getCourses().pipe(map((allCourses) => allCourses.find((el) => el.id === id)));
  }

  addCourse(newCourse: Course): Observable<Course[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.getCourses().pipe(
      map(courses => {
        const maxId = courses.length > 0 ? Math.max(...courses.map(course => parseInt(course.id))) : 0;
        newCourse.id = (maxId + 1).toString();
        return newCourse;
      }),
      switchMap(courseWithId => 
        this.httpClient.post<Course>(this.coursesUrl, courseWithId, { headers })
      ),
      switchMap(() => this.getCourses())
    );
  }

  deleteCourseById(id: string): Observable<Course[]> {
    return this.enrollmentsService.deleteEnrollmentsByCourse(id).pipe(
      concatMap(() => this.httpClient.delete(`${this.coursesUrl}/${id}`)),
      switchMap(() => this.getCourses())
    );
  }

}

