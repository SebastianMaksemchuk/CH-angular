import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../../shared/interfaces/user';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ data: User[] }>(),
    'Load Users Failure': props<{ error: unknown }>(),
    'Unset Users State': emptyProps(),
  }
});
