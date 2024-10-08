import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, switchMap, take } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { Student } from '../../../shared/interfaces/student';
import { Course } from '../../../shared/interfaces/course';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { RootState } from '../../../core/store/store';
import { selectEnrollments, selectEnrollmentsError, selectEnrollmentsIsLoading } from './store/enrollments.selectors';
import { Store } from '@ngrx/store';
import { EnrollmentsActions } from './store/enrollments.actions';
import { selectCourses } from '../courses/store/courses.selectors';
import { selectStudents } from '../students/store/students.selectors';
import { CoursesActions } from '../courses/store/courses.actions';
import { StudentsActions } from '../students/store/students.actions';
import { selectAuthUserId } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'cha-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss'
})

export class EnrollmentsComponent implements OnInit, OnDestroy {
  authUserId$: Observable<string | undefined>;

  displayedColumns: string[] = ['student', 'course', 'delete']

  enrollments$: Observable<Enrollment[] | any[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  courses$: Observable<Course[]>;
  students$: Observable<Student[]>;;
  filteredEnrollments$ = new BehaviorSubject<Enrollment[]>([]);

  constructor(
    private store: Store<RootState>,
    public matDialog: MatDialog
  ) {
    this.enrollments$ = this.store.select(selectEnrollments),
      this.isLoading$ = this.store.select(selectEnrollmentsIsLoading),
      this.error$ = this.store.select(selectEnrollmentsError),
      this.courses$ = this.store.select(selectCourses),
      this.students$ = this.store.select(selectStudents),
      this.authUserId$ = this.store.select(selectAuthUserId)
  }

  ngOnInit(): void {
    this.store.dispatch(EnrollmentsActions.loadEnrollments());
    this.store.dispatch(CoursesActions.loadCourses());
    this.store.dispatch(StudentsActions.loadStudents());
    this.enrollments$.subscribe(enrollments => {this.filteredEnrollments$.next(enrollments);});
  }

  ngOnDestroy(): void {
    this.store.dispatch(EnrollmentsActions.unsetEnrollmentsStore());
    this.store.dispatch(CoursesActions.unsetCoursesStore());
    this.store.dispatch(StudentsActions.unsetStudentsStore());
  }

  reloadPage(): void {
    location.reload;
  }

  openEnrollmentDialog(): void {
    this.matDialog.open(EnrollmentDialogComponent, {
      data: {
        courses$: this.courses$,
        students$: this.students$
      }
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.authUserId$.pipe(
            take(1),
            map(userId => ({
              ...result,
              enrollmentDate: new Date(),
              enrolledByUserId: userId
            }))
          )
        )
      )
      .subscribe(payload => {
        this.store.dispatch(EnrollmentsActions.createEnrollment({ payload }));
      });
  };

  deleteEnrollmentById(id: string) {
    if (confirm('¿Está seguro que desea elminiar esta inscripción?')) {
      this.store.dispatch(EnrollmentsActions.deleteEnrollment({ id: id }))
      this.resetFilter();
    };
  };

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.enrollments$.pipe(
      map(enrollments => enrollments.filter(enrollment =>
        enrollment.student.firstName.toLowerCase().includes(filterValue) ||
        enrollment.student.lastName.toLowerCase().includes(filterValue) ||
        enrollment.course.name.toLowerCase().includes(filterValue) ||
        enrollment.course.comision.toString().includes(filterValue)
      ))
    ).subscribe(filtered => {
      this.filteredEnrollments$.next(filtered);
    });
  };

  resetFilter(): void {
    this.enrollments$.subscribe(enrollments => {
      this.filteredEnrollments$.next(enrollments);
      const input = document.querySelector('#input') as HTMLInputElement;
      if (input) {
        input.value = '';
      };
    });
  };
}