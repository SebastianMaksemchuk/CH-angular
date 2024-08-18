import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { EnrollmentsActions } from './enrollments.actions';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';


@Injectable()
export class EnrollmentsEffects {

  loadEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollments),
      concatMap(() =>
        this.enrollmentsService.getEnrollments().pipe(
          map(data => EnrollmentsActions.loadEnrollmentsSuccess({ data })),
          catchError(error => of(EnrollmentsActions.loadEnrollmentsFailure({ error }))))
      )
    );
  });

  CreateEnrollment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsActions.createEnrollment),
      concatMap((action) =>
        this.enrollmentsService.createEnrollment(action.payload).pipe(
          map(data => EnrollmentsActions.createEnrollmentSuccess({ data })),
          catchError(error => of(EnrollmentsActions.createEnrollmentFailure({ error }))))
      )
    );
  });

  deleteEnrollment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsActions.deleteEnrollment),
      concatMap((action) =>
        this.enrollmentsService.deleteEnrollmentById(action.id).pipe(
          map(data => EnrollmentsActions.deleteEnrollmentSuccess({ data })),
          catchError(error => of(EnrollmentsActions.deleteEnrollmentFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions, private enrollmentsService: EnrollmentsService) {}
}
