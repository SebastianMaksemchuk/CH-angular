import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCourses from './courses.reducer';

export const selectCoursesState = createFeatureSelector<fromCourses.State>(
  fromCourses.coursesFeatureKey
);


export const selectCourses = createSelector(selectCoursesState, (state)=> state.courses)
export const selectSelectedCourse = createSelector(selectCoursesState, (state)=> state.selectedCourse)
export const selectCoursesIsLoading = createSelector(selectCoursesState, (state)=> state.isLoading)
export const selectCoursesError = createSelector(selectCoursesState, (state)=> state.error)