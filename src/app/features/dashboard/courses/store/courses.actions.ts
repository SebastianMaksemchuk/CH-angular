import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ data: unknown }>(),
    'Load Courses Failure': props<{ error: unknown }>(),
  }
});
