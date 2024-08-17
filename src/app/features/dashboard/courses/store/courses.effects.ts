import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { CoursesActions } from './courses.actions';


@Injectable()
export class CoursesEffects {

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(CoursesActions.loadCourses),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => CoursesActions.loadCoursesSuccess({ data })),
          catchError(error => of(CoursesActions.loadCoursesFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
