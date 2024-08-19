import { Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from '../../../../../shared/interfaces/student';
import { ActivatedRoute } from '@angular/router';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';
import { combineLatest, forkJoin, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../core/store/store';
import { selectSelecterStudent, selectStudents, selectStudentsError, selectStudentsIsLoading } from '../../store/students.selectors';
import { selectEnrollments } from '../../../enrollments/store/enrollments.selectors';
import { StudentsActions } from '../../store/students.actions';
import { EnrollmentsActions } from '../../../enrollments/store/enrollments.actions';

@Component({
  selector: 'cha-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})

export class StudentDetailComponent implements OnInit, OnDestroy {

  students$: Observable<Student[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  selectedStudent$: Observable<Student | null>;
  enrollments$: Observable<Enrollment[]>;
  filteredEnrollments$: Observable<any>;

  constructor(
    private store: Store<RootState>,
    private route: ActivatedRoute,
  ) {
    this.students$ = this.store.select(selectStudents);
    this.isLoading$ = this.store.select(selectStudentsIsLoading);
    this.error$ = this.store.select(selectStudentsError);
    this.selectedStudent$ = this.store.select(selectSelecterStudent);
    this.enrollments$ = this.store.select(selectEnrollments);
    this.filteredEnrollments$ = combineLatest([
      this.enrollments$,
      this.selectedStudent$
    ]).pipe(
      map(([enrollments, selectedStudent]) =>
        enrollments.filter(enrollment => enrollment.studentId === selectedStudent?.id)
      )
    );
  };

  ngOnInit(): void {
    this.store.dispatch(StudentsActions.loadStudents());
    this.store.dispatch(StudentsActions.loadStudentById({id:this.route.snapshot.paramMap.get('id') ?? "" }));
    this.store.dispatch(EnrollmentsActions.loadEnrollments());
  }

  ngOnDestroy(): void {
    this.store.dispatch(StudentsActions.unsetStudentsStore());
    this.store.dispatch(EnrollmentsActions.unsetEnrollmentsStore());
  };

  reloadPage() {
    location.reload();
  };

  deleteEnrollmentById(id: string) {
    if (confirm('¿Está seguro que desea elminar esta inscripción?')) {
      this.store.dispatch(EnrollmentsActions.deleteEnrollment({ id: id }))
    }
  };
}