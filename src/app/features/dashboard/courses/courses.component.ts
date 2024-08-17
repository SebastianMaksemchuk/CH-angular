import { Component, OnDestroy, OnInit } from '@angular/core';

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../../shared/interfaces/course';
import { forkJoin, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootState } from '../../../core/store/store';
import { selectCourses, selectCoursesError, selectCoursesIsLoading } from './store/courses.selectors';
import { CoursesActions } from './store/courses.actions';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['comision', 'course', 'startDate', 'endDate', 'details', 'edit', 'delete'];

  courses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private store: Store<RootState>,
    private matDialog: MatDialog,
  ) {
    this.courses$ = this.store.select(selectCourses);
    this.isLoading$ = this.store.select(selectCoursesIsLoading);
    this.error$ = this.store.select(selectCoursesError);
  }

  ngOnInit(): void {
    this.store.dispatch(CoursesActions.loadCourses())

  }

  ngOnDestroy(): void {
this.store.dispatch(CoursesActions.unsetCoursesStore())
  }

  reloadPage(): void {
    location.reload()
  }

  openCourseDialog(course?: Course): void {
    this.matDialog
    .open(CourseDialogComponent, {data: course})
    .afterClosed()
    .subscribe(result => {
      if (!course && result) {
        this.store.dispatch(CoursesActions.createCourse({payload: result}))
      };
      if (course) {
        this.store.dispatch(CoursesActions.editCourse({id: result.id, payload: result}))
      }
    })
  }

  deleteCourseById(id: string): void {
    if (confirm('¿Está seguro que esea elminiar este curso?')) {
      this.store.dispatch(CoursesActions.deleteCourse({id:id}))
    }
  }
}