import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Enrollment } from '../../../../shared/interfaces/enrollment';

export const EnrollmentsActions = createActionGroup({
  source: 'Enrollments',
  events: {
    'Load Enrollments': emptyProps(),
    'Load Enrollments Success': props<{ data: Enrollment[] }>(),
    'Load Enrollments Failure': props<{ error: unknown }>(),
    'Create Enrollment': props<{ payload: Enrollment }>(),
    'Create Enrollment Success': props<{ data: Enrollment }>(),
    'Create Enrollment Failure': props<{ error: unknown }>(),
    'DeleteEnrollment': props<{ id: string }>(),
    'DeleteEnrollment Success': props<{ data: Enrollment }>(),
    'DeleteEnrollment Failure': props<{ error: unknown }>(),
    'UnsetEnrollments Store': emptyProps()
  }
});
