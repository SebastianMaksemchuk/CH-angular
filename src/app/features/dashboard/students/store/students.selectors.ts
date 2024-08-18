import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStudents from './students.reducer';

export const selectStudentsState = createFeatureSelector<fromStudents.State>(
  fromStudents.studentsFeatureKey
);

export const selectStudents = createSelector(selectStudentsState, (state)=> state.students)
export const selectSelecterStudent = createSelector(selectStudentsState, (state)=> state.selectedStudent)
export const selectStudentsIsLoading = createSelector(selectStudentsState, (state)=> state.isLoading)
export const selectStudentsError = createSelector(selectStudentsState, (state)=> state.error)