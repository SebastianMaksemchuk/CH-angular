import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
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
      enrolledStudents: []
    },
    {
      id: 2,
      comision: 57210,
      name: 'JavaScript',
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-03-25'),
      studentQuota: 110,
      enrolledStudents: []
    },
    {
      id: 3,
      comision: 57210,
      name: 'Angular',
      startDate: new Date('2024-06-10'),
      endDate: new Date('2024-08-12'),
      studentQuota: 100,
      enrolledStudents: []
    },
    {
      id: 4,
      comision: 57300,
      name: 'React Js',
      startDate: new Date('2024-08-05'),
      endDate: new Date('2024-09-23'),
      studentQuota: 100,
      enrolledStudents: []
    },
    {
      id: 5,
      comision: 58010,
      name: 'Data Science I',
      startDate: new Date('2024-08-03'),
      endDate: new Date('2024-10-05'),
      studentQuota: 100,
      enrolledStudents: []
    },
    {
      id: 6,
      comision: 51111,
      name: 'Data Science II',
      startDate: new Date('2024-08-13'),
      endDate: new Date('2024-11-26'),
      studentQuota: 100,
      enrolledStudents: []
    },
    {
      id: 7,
      comision: 52222,
      name: 'Blockchain',
      startDate: new Date('2024-09-09'),
      endDate: new Date('2024-10-21'),
      studentQuota: 100,
      enrolledStudents: []
    },
    {
      id: 8,
      comision: 53333,
      name: 'Looker Studio',
      startDate: new Date('2024-09-12'),
      endDate: new Date('2024-09-23'),
      studentQuota: 100,
      enrolledStudents: []
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

  addCourse(newCourse: Course): Observable<Course[]> {
    const newId = Math.max(...this.coursesDatabase.map(e => e.id)) + 1;
    this.coursesDatabase.push(
      {
        id: newId,
        comision: newCourse.comision,
        name: newCourse.name,
        startDate: newCourse.startDate,
        endDate: newCourse.endDate,
        studentQuota: newCourse.studentQuota,
        enrolledStudents: []
      }
    );
    return this.getCourses();
  }

  deleteCourseById(id: number): Observable<Course[]> {
    this.coursesDatabase = this.coursesDatabase.filter((el) => el.id != id);
    return this.getCourses().pipe(delay(400));
  }

}

