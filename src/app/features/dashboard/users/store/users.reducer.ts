import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { User } from '../../../../shared/interfaces/user';

export const usersFeatureKey = 'users';

export interface State {
  isLoading: boolean,
  users: User[],
  error: unknown
}

export const initialState: State = {
  isLoading: false,
  users: [],
  error: null
};

export const reducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(UsersActions.loadUsersSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      users: action.data
    }
  }),
  on(UsersActions.loadUsersFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    }
  },
),  on(UsersActions.unsetUsersState, () => {
  return initialState
},
)
);

export const usersFeature = createFeature({
  name: usersFeatureKey,
  reducer,
});

