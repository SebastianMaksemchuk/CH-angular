import { Component } from '@angular/core';

import { Course } from '../../global/interfaces/course';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {
  dataSource: Course[] = [];
  idIndex: number = 0;
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'spots', 'details', 'edit', 'delete'];

  constructor(private matDialog: MatDialog) {
    this.dataSource = [
      {
        id: ++this.idIndex,
        comision: 60160,
        name: 'Desarrollo Web',
        startDate: new Date('2023-08-28'),
        endDate: new Date('2023-11-01'),
        studentQuota: 120,
        subscribedStudents: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
      },
      {
        id: ++this.idIndex,
        comision: 57210,
        name: 'JavaScript',
        startDate: new Date('2024-01-22'),
        endDate: new Date('2024-03-25'),
        studentQuota: 110,
        subscribedStudents: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
      },
      {
        id: ++this.idIndex,
        comision: 57210,
        name: 'Angular',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-08-12'),
        studentQuota: 100,
        subscribedStudents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
      }
    ];
  };

  openDialog(): void {
    this.matDialog
      .open(CourseDialogComponent)
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value['comision']) {
            value['id'] = ++this.idIndex
            value['subscribedStudents'] = []
            this.dataSource = [...this.dataSource, value]
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
