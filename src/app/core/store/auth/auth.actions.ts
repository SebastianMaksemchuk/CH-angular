import { createAction, props } from "@ngrx/store";
import { User } from "../../../shared/interfaces/user";

export const setAuthUser = createAction(
  '[Auth] set auth user',
  props<{ payload: User }>()
);

export const unsetAuthUser = createAction(
  '[Auth] unset auth user',
)