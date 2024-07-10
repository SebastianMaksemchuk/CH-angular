import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from '../../global/interfaces/courses';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  nombreCurso = ""

  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'edit', 'delete'];
  dataSource: Course[] = [
    {
      id: '001',
      name: 'Angular',
      startDate: new Date(),
      endDate: new Date()
    },
    {
      id: '002',
      name: 'Photoshop',
      startDate: new Date(),
      endDate: new Date()
    },
    {
      id: '003',
      name: 'Typescript',
      startDate: new Date(),
      endDate: new Date()
    }

  ]

  constructor(private matDialog: MatDialog) { }
  openDialog(): void {
    this.matDialog
    .open(CourseDialogComponent)
    .afterClosed()
    .subscribe({
      next: (value) => {
        console.log(value)
        this.nombreCurso = value.name
        value['id'] = this.dataSource.length + 1
        this.dataSource = [...this.dataSource, value]
      }
    })
  }

  editCourse(course: Course) {
    this.matDialog
    .open(CourseDialogComponent, { data: course })
    .afterClosed()
    .subscribe({
      next: (value) => {
        if (!!value) {
          this.dataSource = this.dataSource.map((el)=>el.id === course.id ? value : el)
        }
      }
    });
  }

  deleteCourseById(id: string | number) {
    this.dataSource = this.dataSource.filter(el => el.id != id)
  }
}
