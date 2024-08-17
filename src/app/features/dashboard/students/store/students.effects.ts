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


  constructor(private actions$: Actions, private studentsService: StudentsService) {}
}
