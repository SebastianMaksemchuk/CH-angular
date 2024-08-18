import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Student } from '../../../../shared/interfaces/student';

export const StudentsActions = createActionGroup({
  source: 'Students',
  events: {
    'Load Students': emptyProps(),
    'Load Students Success': props<{ data: Student[] }>(),
    'Load Students Failure': props<{ error: unknown }>(),
    'Create Student': props<{ payload: Student }>(),
    'Create Student Success': props<{ data: Student }>(),
    'Create Student Failure': props<{ error: unknown }>(),
    'Edit Student': props<{ id: string, payload: Student }>(),
    'Edit Student Success': props<{ data: Student }>(),
    'Edit Student Failure': props<{ error: unknown }>(),
    'Delete Student': props<{ id: string }>(),
    'Delete Student Success': props<{ data: Student }>(),
    'Delete Student Failure': props<{ error: unknown }>(),
    'Load Student By Id': props<{ id: string }>(),
    'Load Student By Id Success': props<{ data: Student }>(),
    'Load Student By Id Failure': props<{ error: unknown }>(),
    'Unset Students Store': emptyProps()
  }
});
