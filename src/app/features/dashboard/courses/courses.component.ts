import { Component } from '@angular/core';

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../../shared/interfaces/course';
import { CoursesService } from '../../../core/services/courses.service';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'spots', 'details', 'edit', 'delete'];
  dataSource: Course[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private coursesService: CoursesService) {
  }

  ngOnInit(): void {
    this.loadCourses()
  }

  loadCourses() {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.dataSource = courses;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  openDialog(): void {
    this.matDialog
      .open(CourseDialogComponent)
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value['comision']) {
            value['id'] = this.dataSource.length + 1;
            value['subscribedStudents'] = [];
            this.dataSource = [...this.dataSource, value];
          };
        }
      })
  };

  editCourse(course: Course) {
    this.matDialog
      .open(CourseDialogComponent, { data: course })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (!!value) {
            this.dataSource = this.dataSource.map((el) => el.id === course.id ? value : el);
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
