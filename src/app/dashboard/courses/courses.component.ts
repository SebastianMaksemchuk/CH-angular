import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
nombreCurso = ""

 constructor(private matDialog: MatDialog) {}
 openDialog(): void {
  this.matDialog.open(CourseDialogComponent).afterClosed().subscribe({
    next: (value) => {
      console.log(value)
      this.nombreCurso = value.name
    }
  })
 }
}
