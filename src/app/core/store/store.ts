import { ActionReducerMap } from "@ngrx/store";
import { authFeatureName, authReducer, AuthState } from "./auth/auth.reducer";
import { dashboardFeatureName, dashboardReducer, DashboardState } from "./dashboard/dashboard.reducer";

export interface RootState {
  [authFeatureName]: AuthState
  [dashboardFeatureName]: DashboardState
}

export const rootReducer: ActionReducerMap<RootState> = {
  [authFeatureName]: authReducer,
  [dashboardFeatureName]: dashboardReducer
}