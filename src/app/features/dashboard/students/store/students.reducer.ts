import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentsActions } from './students.actions';
import { Student } from '../../../../shared/interfaces/student';

export const studentsFeatureKey = 'students';

export interface State {
  isLoading: boolean;
  students: Student[];
  selectedStudent: Student | null,
  error: unknown;
}

export const initialState: State = {
  isLoading: false,
  students: [],
  selectedStudent: null,
  error: null
};

export const reducer = createReducer(
  initialState,

  on(StudentsActions.loadStudents, state => ({ ...state, isLoading: true })),
  on(StudentsActions.loadStudentsSuccess, (state, action) => ({ ...state, isLoading: false, students: action.data, error: null })),
  on(StudentsActions.loadStudentsFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  
  on(StudentsActions.createStudent, (state) => { return { ...state, isLoading: true } }),
  on(StudentsActions.createStudentSuccess, (state, action) => { return { ...state, isLoading: false, error: null, students: [...state.students, action.data] } }),
  on(StudentsActions.createStudentFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(StudentsActions.editStudent, (state) => { return { ...state, isLoading: true } }),
  on(StudentsActions.editStudentSuccess, (state, action) => { return { ...state, isLoading: false, error: null, students: state.students.map(student => student.id === action.data.id ? action.data : student) } }),
  on(StudentsActions.editStudentFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(StudentsActions.deleteStudent, state => ({ ...state, isLoading: true })),
  on(StudentsActions.deleteStudentSuccess, (state, action) => ({ ...state, isLoading: false, students: state.students.filter((student) => student.id !== action.data.id), error: null })),
  on(StudentsActions.deleteStudentFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  
  on(StudentsActions.loadStudentById, (state) => { return { ...state, isLoading: true, }; }),
  on(StudentsActions.loadStudentByIdSuccess, (state, action) => { return { ...state, isLoading: false, error: null, selectedStudent: action.data } }),
  on(StudentsActions.loadStudentByIdFailure, (state, action) => { return { ...state, isLoading: false, error: action.error } }),

  on(StudentsActions.unsetStudentsStore, () => { return initialState },)
);

export const studentsFeature = createFeature({
  name: studentsFeatureKey,
  reducer,
});

