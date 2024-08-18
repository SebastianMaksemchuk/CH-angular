import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUsers from './users.reducer';

export const selectUsersState = createFeatureSelector<fromUsers.State>(
  fromUsers.usersFeatureKey
);

export const selectUsers = createSelector(selectUsersState, (state)=> state.users)
export const selectUsersIsLoading = createSelector(selectUsersState, (state)=> state.isLoading)
export const selectUsersError = createSelector(selectUsersState, (state)=> state.error)
export const selectSelectedUser = createSelector(selectUsersState, (state)=> state.selectedUser)