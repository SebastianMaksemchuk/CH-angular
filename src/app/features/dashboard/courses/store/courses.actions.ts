import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course } from '../../../../shared/interfaces/course';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'LoadCourses': emptyProps(),
    'LoadCourses Success': props<{ data: Course[] }>(),
    'LoadCourses Failure': props<{ error: unknown }>(),
    'CreateCourse': props<{ payload: Course }>(),
    'CreateCourse Success': props<{ data: Course }>(),
    'CreateCourse Failure': props<{ error: unknown }>(),
    'EditCourse': props<{ id: string, payload: Course }>(),
    'EditCourse Success': props<{ data: Course }>(),
    'EditCourse Failure': props<{ error: unknown }>(),
    'DeleteCourse': props<{ id: string }>(),
    'DeleteCourse Success': props<{ data: Course }>(),
    'DeleteCourse Failure': props<{ error: unknown }>(),
    'LoadCourse By Id': props<{ id: string }>(),
    'LoadCourse By Id Success': props<{ data: Course }>(),
    'LoadCourse By Id Failure': props<{ error: unknown }>(),
    'UnsetCourses Store': emptyProps()
  }
});
