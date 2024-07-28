import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Course } from '../../shared/interfaces/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesDatabase = [
    {
      id: 1,
      comision: 60160,
      name: 'Desarrollo Web',
      startDate: new Date('2023-08-28'),
      endDate: new Date('2023-11-01'),
      studentQuota: 120,
      subscribedStudents: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    },
    {
      id: 2,
      comision: 57210,
      name: 'JavaScript',
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-03-25'),
      studentQuota: 110,
      subscribedStudents: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    },
    {
      id: 3,
      comision: 57210,
      name: 'Angular',
      startDate: new Date('2024-06-10'),
      endDate: new Date('2024-08-12'),
      studentQuota: 100,
      subscribedStudents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  ]

  getCourses(): Observable<Course[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.coursesDatabase);
        observer.complete();
      }, 500);
    });
  }

  getCourseById(id: number): Observable<Course | undefined> {
    return this.getCourses().pipe(map((allCourses) => allCourses.find((el) => el.id === id)));
  }

  addCourse(course: Course): Observable<Course[]> {
    this.coursesDatabase.push(course);
    return this.getCourses();
  }

  deleteCourseById(id: number): Observable<Course[]> {
    this.coursesDatabase = this.coursesDatabase.filter((el) => el.id != id);
    return this.getCourses();
  }

}

