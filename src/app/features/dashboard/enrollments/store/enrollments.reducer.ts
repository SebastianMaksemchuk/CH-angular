import { createFeature, createReducer, on } from '@ngrx/store';
import { EnrollmentsActions } from './enrollments.actions';
import { Enrollment } from '../../../../shared/interfaces/enrollment';

export const enrollmentsFeatureKey = 'enrollments';

export interface State {
  isLoading: boolean;
  enrollments: Enrollment[];
  error: unknown;
}

export const initialState: State = {
  isLoading: false,
  enrollments: [],
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(EnrollmentsActions.loadEnrollments, (state) => {return { ...state, isLoading: true }}),
  on(EnrollmentsActions.loadEnrollmentsSuccess, (state, action) => {return {...state, isLoading: false, error: null, enrollments: action.data}}),
  on(EnrollmentsActions.loadEnrollmentsFailure, (state, action) => {return {...state, isLoading:false,error:action.error}}),
  on(EnrollmentsActions.createEnrollment, (state) => {return {...state, isLoading:true}}),
  on(EnrollmentsActions.createEnrollmentSuccess, (state,action) =>{return {...state, isLoading:false, error: null, enrollments: [...state.enrollments, action.data]}} ),
  on(EnrollmentsActions.createEnrollmentFailure, (state,action) => {return {...state, isLoading:false, error: action.error}}),
  on(EnrollmentsActions.deleteEnrollment, (state) => {return {...state, isLoading:true}}),
  on(EnrollmentsActions.deleteEnrollmentSuccess,(state, action) => ({ ...state, isLoading: false, error: null, enrollments: state.enrollments.filter((enrollment) => enrollment.id !== action.data.id) })),
  on(EnrollmentsActions.deleteEnrollmentFailure, (state,action) => {return {...state, isLoading: false, error: action.error}}),
  on(EnrollmentsActions.unsetEnrollmentsStore, () => {return initialState}),
);

export const enrollmentsFeature = createFeature({
  name: enrollmentsFeatureKey,
  reducer,
});

