import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course } from '../../../../shared/interfaces/course';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ data: Course[] }>(),
    'Load Courses Failure': props<{ error: unknown }>(),
    'Create Course': props<{ payload: Course }>(),
    'Create Course Success': props<{ data: Course }>(),
    'Create Course Failure': props<{ error: unknown }>(),
    'Edit Course': props<{ id: string, payload: Course }>(),
    'Edit Course Success': props<{ data: Course }>(),
    'Edit Course Failure': props<{ error: unknown }>(),
    'Delete Course': props<{ id: string }>(),
    'Delete Course Success': props<{ data: Course }>(),
    'Delete Course Failure': props<{ error: unknown }>(),
    'Load Course By Id': props<{ id: string }>(),
    'Load Course By Id Success': props<{ data: Course }>(),
    'Load Course By Id Failure': props<{ error: unknown }>(),
    'Unset Courses Store': emptyProps()
  }
});
