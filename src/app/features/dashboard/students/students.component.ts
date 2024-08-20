import { Component, OnDestroy, OnInit } from '@angular/core';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../shared/interfaces/student';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StudentsActions } from './store/students.actions';
import { selectStudents, selectStudentsError, selectStudentsIsLoading } from './store/students.selectors';
import { RootState } from '../../../core/store/store';
import { User } from '../../../shared/interfaces/user';
import { selectAuthUser } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'cha-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent implements OnInit, OnDestroy {
  authUser$: Observable<User | null>

  displayedColumns: string[] = ['name', 'email', 'details', 'edit', 'delete'];

  students$: Observable<Student[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  filteredStudents$ = new BehaviorSubject<Student[]>([]);

  constructor(
    private store: Store<RootState>,
    private matDialog: MatDialog,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.students$ = this.store.select(selectStudents);
    this.isLoading$ = this.store.select(selectStudentsIsLoading);
    this.error$ = this.store.select(selectStudentsError);
  };


  ngOnInit(): void {
    this.store.dispatch(StudentsActions.loadStudents());
    this.students$.subscribe(students => {this.filteredStudents$.next(students)});
  };

  ngOnDestroy(): void {
    this.store.dispatch(StudentsActions.unsetStudentsStore());
  };

  reloadPage(): void {
    location.reload();
  };

  openStudentDialog(student?: Student): void {
    this.matDialog
      .open(StudentDialogComponent, { data: student })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          if (!student) {
            this.store.dispatch(StudentsActions.createStudent({ payload: result }))
          } else {
              this.store.dispatch(StudentsActions.editStudent({ id: result.id, payload: result }))
        };
        this.resetFilter();
        };
      })
  };

  deleteStudentById(id: string): void {
    if (confirm('¿Está seguro que desea elminiar este alumno?')) {
      this.store.dispatch(StudentsActions.deleteStudent({ id: id }))
      this.resetFilter();
    };
  };

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.students$.pipe(
      map(students => students.filter(student =>
        student.firstName.toLowerCase().includes(filterValue) ||
        student.lastName.toLowerCase().includes(filterValue) ||
        student.email.toLowerCase().includes(filterValue)
      ))
    ).subscribe(filtered => {
      this.filteredStudents$.next(filtered);
    });
  }

  resetFilter(): void {
    this.students$.subscribe(students => {
      this.filteredStudents$.next(students);
      const input = document.querySelector('#input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    });
  }
}