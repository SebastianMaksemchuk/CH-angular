import { createReducer, on } from "@ngrx/store";
import { DashboardActions } from "./dashboard.actions";

export const dashboardFeatureName = 'dashboard'

export interface DashboardState {
  currentMainFeature: string;
}

const initialState: DashboardState = {
  currentMainFeature: 'home'
}

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.setDashboardMainFeature, (state, action) => { return { ...state, currentMainFeature: action.payload, }; }),
)