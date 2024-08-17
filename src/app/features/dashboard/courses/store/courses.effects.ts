import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { CoursesActions } from './courses.actions';
import { CoursesService } from '../../../../core/services/courses.service';


@Injectable()
export class CoursesEffects {

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.loadCourses),
      concatMap(() =>
        this.coursesService.getCourses().pipe(
          map(data => CoursesActions.loadCoursesSuccess({ data })),
          catchError(error => of(CoursesActions.loadCoursesFailure({ error }))))
      )
    );
  });

  createCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.createCourse),
      concatMap((action) =>
        this.coursesService.createCourse(action.payload).pipe(
          map(data => CoursesActions.createCourseSuccess({ data })),
          catchError(error => of(CoursesActions.createCourseFailure({ error })))
        )
      )
    )
  })

  editCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.editCourse),
      concatMap((action) => 
      this.coursesService.editCourseById(action.id,action.payload).pipe(
        map(data => CoursesActions.editCourseSuccess({data})),
        catchError(error => of(CoursesActions.editCourseFailure({error})))
      ))
    )
  })

  deleteCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.deleteCourse),
      concatMap((action) =>
        this.coursesService.deleteCourseById(action.id).pipe(
          map(data => CoursesActions.deleteCourseSuccess({ data })),
          catchError(error => of(CoursesActions.deleteCourseFailure({ error }))))
      )
    );
  });

  loadCourseById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.loadCourseById),
      concatMap((action) =>
        this.coursesService.getCourseById(action.id).pipe(
          map(data => CoursesActions.loadCourseByIdSuccess({ data })),
          catchError(error => of(CoursesActions.loadCourseByIdFailure({ error }))))
      )
    );
  });

  constructor(private actions$: Actions, private coursesService: CoursesService) {}
}
