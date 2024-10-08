import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Course } from '../../../../../shared/interfaces/course';
import { ActivatedRoute } from '@angular/router';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../core/store/store';
import { selectCourses, selectCoursesError, selectCoursesIsLoading, selectSelectedCourse } from '../../store/courses.selectors';
import { selectEnrollments } from '../../../enrollments/store/enrollments.selectors';
import { CoursesActions } from '../../store/courses.actions';
import { EnrollmentsActions } from '../../../enrollments/store/enrollments.actions';
import { User } from '../../../../../shared/interfaces/user';
import { selectUsers } from '../../../users/store/users.selectors';
import { UsersActions } from '../../../users/store/users.actions';

@Component({
  selector: 'cha-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})

export class CourseDetailComponent implements OnInit, OnDestroy {

  courses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  selectedCourse$: Observable<Course | null>;
  enrollments$: Observable<Enrollment[]>;
  filteredEnrollments$: Observable<any>;
  users$: Observable<User[]>;
  teacher$: Observable<User | undefined>;

  constructor(
    private store: Store<RootState>,
    private route: ActivatedRoute,
  ) {
    this.courses$ = this.store.select(selectCourses);
    this.isLoading$ = this.store.select(selectCoursesIsLoading);
    this.error$ = this.store.select(selectCoursesError);
    this.selectedCourse$ = this.store.select(selectSelectedCourse);
    this.enrollments$ = this.store.select(selectEnrollments);
    this.filteredEnrollments$ = combineLatest([
      this.enrollments$,
      this.selectedCourse$
    ]).pipe(
      map(([enrollments, selectedCourse]) =>
        enrollments.filter(enrollment => enrollment.courseId === selectedCourse?.id)
      )
    );
    this.users$ = this.store.select(selectUsers);
    this.teacher$ = combineLatest([
      this.users$,
      this.selectedCourse$
    ]).pipe(
      map(([users, selectedCourse]) =>
        users.find(teacher => teacher.id === selectedCourse?.teacherId)
      )
    );
  }

  ngOnInit(): void {
    this.store.dispatch(
      CoursesActions.loadCourses()
    );
    this.store.dispatch(CoursesActions.loadCourseById({ id: this.route.snapshot.paramMap.get('id') ?? "" }));
    this.store.dispatch(EnrollmentsActions.loadEnrollments());
    this.store.dispatch(UsersActions.loadUsers());
  }

  ngOnDestroy(): void {
    this.store.dispatch(CoursesActions.unsetCoursesStore());
    this.store.dispatch(EnrollmentsActions.unsetEnrollmentsStore());
    this.store.dispatch(UsersActions.unsetUsersState());
  }

  reloadPage() {
    location.reload()
  }

  deleteEnrollmentById(id: string) {
    if (confirm('¿Está seguro que desea elminar esta inscripción?')) {
      this.store.dispatch(EnrollmentsActions.deleteEnrollment({ id: id }))
    }
  }

}