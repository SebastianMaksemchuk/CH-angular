import { Component } from '@angular/core';

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../../shared/interfaces/course';
import { CoursesService } from '../../../core/services/courses.service';
import { forkJoin, Observable } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { EnrollmentsService } from '../../../core/services/enrollment.service';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'enrolledCount', 'details', 'edit', 'delete'];

  courses: Course[] = [];
  courses$: Observable<Course[]>;
  enrollments: Enrollment[] = [];
  enrollments$: Observable<Enrollment[]>;
  dataSource: any[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService
  ) {
    this.courses$ = this.coursesService.getCourses();
    this.enrollments$ = this.enrollmentsService.getEnrollments();
  }

  ngOnInit(): void {
    this.loadCourses()
  }

  loadCourses() {
    this.isLoading = true;
    forkJoin([this.courses$, this.enrollments$]).subscribe({
      next: ([courses, enrollments]) => {
        this.courses = courses;
        this.enrollments = enrollments;
        this.updateDataSource();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateDataSource() {
    this.dataSource = this.courses.map(course => {
      const enrolledCount = this.enrollments.filter(enrollment => enrollment.courseId === course.id).length;
      return {
        id: course.id,
        name: course.name,
        startDate: course.startDate,
        endDate: course.endDate,
        enrolledCount: enrolledCount
      };
    });
  }

  openDialog(): void {
    this.matDialog
      .open(CourseDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.coursesService.addCourse(result).subscribe({
            next: (updatedCourses) => {
              this.courses = updatedCourses;
              this.updateDataSource();
            }
          })
        }
      }
      )
  };

  editCourse(course: Course) {
    this.matDialog
      .open(CourseDialogComponent, { data: course })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (!!value) {
            this.courses = this.courses.map((el) => el.id === course.id ? value : el);
            this.updateDataSource()
          };
        }
      });
  };

  deleteCourseById(id: string) {
    if (confirm('¿Desea elminiar este curso?')) {
      this.isLoading = true;
      this.coursesService.deleteCourseById(id).subscribe({
        next: (updatedCourses) => {
          this.courses = updatedCourses;
          this.updateDataSource();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}