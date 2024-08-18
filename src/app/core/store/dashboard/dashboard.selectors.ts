import { createFeatureSelector, createSelector } from "@ngrx/store";
import { dashboardFeatureName, DashboardState } from "./dashboard.reducer";

export const selectDashboardState = createFeatureSelector<DashboardState>(dashboardFeatureName)

export const selectDashboardMainFeature = createSelector(selectDashboardState, (state) => state.currentMainFeature)