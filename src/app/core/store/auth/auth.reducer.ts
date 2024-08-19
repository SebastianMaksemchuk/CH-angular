import { createReducer, on } from "@ngrx/store";
import { User } from "../../../shared/interfaces/user";
import { AuthActions } from "./auth.actions";

export const authFeatureName = 'auth'

export interface AuthState {
  authUser: User | null;
}

const initialState: AuthState = {
  authUser: null,
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setAuthUser, (state, action) => { return { ...state, authUser: action.payload } }),
  on(AuthActions.unsetAuthUser, () => initialState)
)