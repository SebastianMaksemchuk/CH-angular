import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../../shared/interfaces/user";

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Auth User': props<{ payload : User}>(),
    'Unset Auth User': emptyProps()
  }
})
