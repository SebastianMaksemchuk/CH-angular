import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { User } from '../../../../shared/interfaces/user';
import { state } from '@angular/animations';

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

  on(UsersActions.loadUsers, (state) => { return { ...state, isLoading: true, }; }),
  on(UsersActions.loadUsersSuccess, (state, action) => { return { ...state, isLoading: false, error: null, users: action.data } }),
  on(UsersActions.loadUsersFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(UsersActions.createUser, (state) => { return { ...state, isLoading: true } }),
  on(UsersActions.createUserSuccess, (state, action) => { return { ...state, isLoading: false, error: null, users: [...state.users, action.data] } }),
  on(UsersActions.createUserFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(UsersActions.editUser, (state) => { return { ...state, isLoading: true } }),
  on(UsersActions.editUserSuccess, (state, action) => { return { ...state, isLoading: false, error: null, users: state.users.map(user => user.id === action.data.id ? action.data : user) } }),
  on(UsersActions.editUserFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(UsersActions.deleteUser, (state) => { return { ...state, isLoading: true } }),
  on(UsersActions.deleteUserSuccess, (state, action) => { return { ...state, isLoading: false, error: null, users: state.users.filter((user) => user.id !== action.data.id) } }),
  on(UsersActions.deleteUserFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(UsersActions.unsetUsersState, () => { return initialState },));

export const usersFeature = createFeature({
  name: usersFeatureKey,
  reducer,
});

