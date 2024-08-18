import { createFeature, createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.actions';
import { Course } from '../../../../shared/interfaces/course';

export const coursesFeatureKey = 'Courses';

export interface State {
  isLoading: boolean;
  courses: Course[];
  selectedCourse: Course | null,
  error: unknown;
}

export const initialState: State = {
  isLoading: false,
  courses: [],
  selectedCourse: null,
  error: null
};

export const reducer = createReducer(
  initialState,

  on(CoursesActions.loadCourses, state => ({ ...state, isLoading: true })),
  on(CoursesActions.loadCoursesSuccess, (state, action) => ({ ...state, isLoading: false, courses: action.data, error: null })),
  on(CoursesActions.loadCoursesFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  
  on(CoursesActions.createCourse, (state) => { return { ...state, isLoading: true } }),
  on(CoursesActions.createCourseSuccess, (state, action) => { return { ...state, isLoading: false, error: null, courses: [...state.courses, action.data] } }),
  on(CoursesActions.createCourseFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(CoursesActions.editCourse, (state) => { return { ...state, isLoading: true } }),
  on(CoursesActions.editCourseSuccess, (state, action) => { return { ...state, isLoading: false, error: null, courses: state.courses.map(course => course.id === action.data.id ? action.data : course) } }),
  on(CoursesActions.editCourseFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(CoursesActions.deleteCourse, state => ({ ...state, isLoading: true })),
  on(CoursesActions.deleteCourseSuccess, (state, action) => ({ ...state, isLoading: false, courses: state.courses.filter((course) => course.id !== action.data.id), error: null })),
  on(CoursesActions.deleteCourseFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  
  on(CoursesActions.loadCourseById, (state) => { return { ...state, isLoading: true, }; }),
  on(CoursesActions.loadCourseByIdSuccess, (state, action) => { return { ...state, isLoading: false, error: null, selectedCourse: action.data } }),
  on(CoursesActions.loadCourseByIdFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(CoursesActions.unsetCoursesStore, () => { return initialState },)
);

export const coursesFeature = createFeature({
  name: coursesFeatureKey,
  reducer,
});

