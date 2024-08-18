import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../../shared/interfaces/user';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ data: User[] }>(),
    'Load Users Failure': props<{ error: unknown }>(),
    'Create User': props<{ payload: User }>(),
    'Create User Success': props<{ data: User }>(),
    'Create User Failure': props<{ error: unknown }>(),
    'Edit User': props<{ id: string, payload: User }>(),
    'Edit User Success': props<{ data: User }>(),
    'Edit User Failure': props<{ error: unknown }>(),
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ data: User }>(),
    'Delete User Failure': props<{ error: unknown }>(),
    'Load User By Id': props<{ id: string }>(),
    'Load User By Id Success': props<{ data: User }>(),
    'Load User By Id Failure': props<{ error: unknown }>(),
    'Unset Users State': emptyProps(),
  }
});
