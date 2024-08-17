import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { StudentsActions } from './students.actions';
import { StudentsService } from '../../../../core/services/students.service';


@Injectable()
export class StudentsEffects {

  loadStudents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentsActions.loadStudents),
      concatMap(() =>
        this.studentsService.getStudents().pipe(
          map(data => StudentsActions.loadStudentsSuccess({ data })),
          catchError(error => of(StudentsActions.loadStudentsFailure({ error }))))
      )
    );
  });

  createStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentsActions.createStudent),
      concatMap((action) =>
        this.studentsService.createStudent(action.payload).pipe(
          map(data => StudentsActions.createStudentSuccess({ data })),
          catchError(error => of(StudentsActions.createStudentFailure({ error })))
        )
      )
    )
  })

  editStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentsActions.editStudent),
      concatMap((action) => 
      this.studentsService.editStudentById(action.id,action.payload).pipe(
        map(data => StudentsActions.editStudentSuccess({data})),
        catchError(error => of(StudentsActions.editStudentFailure({error})))
      ))
    )
  })

  deleteStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentsActions.deleteStudent),
      concatMap((action) =>
        this.studentsService.deleteStudentById(action.id).pipe(
          map(data => StudentsActions.deleteStudentSuccess({ data })),
          catchError(error => of(StudentsActions.deleteStudentFailure({ error }))))
      )
    );
  });

  loadStudentById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentsActions.loadStudentById),
      concatMap((action) =>
        this.studentsService.getStudentById(action.id).pipe(
          map(data => StudentsActions.loadStudentByIdSuccess({ data })),
          catchError(error => of(StudentsActions.loadStudentByIdFailure({ error }))))
      )
    );
  });

  constructor(private actions$: Actions, private studentsService: StudentsService) {}
}
