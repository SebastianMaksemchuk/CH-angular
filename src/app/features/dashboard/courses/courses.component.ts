import { Component, OnDestroy, OnInit } from '@angular/core';

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../../shared/interfaces/course';
import { forkJoin, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootState } from '../../../core/store/store';
import { selectCourses, selectCoursesError, selectCoursesIsLoading } from './store/courses.selectors';
import { CoursesActions } from './store/courses.actions';
import { selectAuthUser } from '../../../core/store/auth/auth.selectors';
import { User } from '../../../shared/interfaces/user';
import { selectUsers } from '../users/store/users.selectors';
import { UsersActions } from '../users/store/users.actions';

@Component({
  selector: 'cha-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent implements OnInit, OnDestroy {
  authUser$: Observable<User | null>

  displayedColumns: string[] = ['comision', 'course', 'startDate', 'endDate', 'details', 'edit', 'delete'];

  courses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  teachers$: Observable<User[]>

  constructor(
    private store: Store<RootState>,
    private matDialog: MatDialog,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.courses$ = this.store.select(selectCourses);
    this.isLoading$ = this.store.select(selectCoursesIsLoading);
    this.error$ = this.store.select(selectCoursesError);
    this.teachers$ = this.store.select(selectUsers).pipe(
      map(users => users.filter(user => user.role === 'TEACHER'))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(CoursesActions.loadCourses())
    this.store.dispatch(UsersActions.loadUsers())
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoursesActions.unsetCoursesStore())
    this.store.dispatch(UsersActions.unsetUsersState())
  }

  reloadPage(): void {
    location.reload()
  }

  openCourseDialog(course?: Course): void {
    this.matDialog
      .open(CourseDialogComponent, { data: { course: course, teachers$: this.teachers$ } })
      .afterClosed()
      .subscribe(result => {
        if (!course && result) {
          this.store.dispatch(CoursesActions.createCourse({ payload: result }))
        };
        if (course && result) {
          this.store.dispatch(CoursesActions.editCourse({ id: result.id, payload: result }))
        }
      })
  }

  deleteCourseById(id: string): void {
    if (confirm('¿Está seguro que esea elminiar este curso?')) {
      this.store.dispatch(CoursesActions.deleteCourse({ id: id }))
    }
  }
}