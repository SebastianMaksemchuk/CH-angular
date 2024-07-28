import { Component } from '@angular/core';

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../../shared/interfaces/course';
import { CoursesService } from '../../../core/services/courses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'spots', 'details', 'edit', 'delete'];

  courses: Course[] = [];
  courses$: Observable<Course[]>;
  dataSource: Course[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private coursesService: CoursesService
  ) {
    this.courses$ = this.coursesService.getCourses();
  }

  ngOnInit(): void {
    this.loadCourses()
  }

  loadCourses() {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.updateDataSource()
        console.log(this.dataSource)
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateDataSource() {
    this.dataSource = this.courses.map(course => ({
      id: course.id,
      comision: course.comision,
      name: course.name,
      startDate: course.startDate,
      endDate: course.endDate,
      studentQuota: course.studentQuota,
      enrolledStudents: course.enrolledStudents
    }));
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

  deleteCourseById(id: string | number) {
    if (confirm('¿Está seguro que desea elminiar este curso?')) {
      this.dataSource = this.dataSource.filter(el => el.id != id);
    }
  };
};
