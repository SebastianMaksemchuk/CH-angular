import { createActionGroup, props } from "@ngrx/store";

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Set Dashboard Main Feature': props<{ payload: string }>()
  }
})
