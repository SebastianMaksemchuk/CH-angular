import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { UsersActions } from './users.actions';
import { UsersService } from '../../../../core/services/users.service';


@Injectable()
export class UsersEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      concatMap(() =>
        this.usersService.getUsers().pipe(
          map(data => UsersActions.loadUsersSuccess({ data })),
          catchError(error => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    );
  });

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.createUser),
      concatMap((action) =>
        this.usersService.createUser(action.payload).pipe(
          map(data => UsersActions.createUserSuccess({ data })),
          catchError(error => of(UsersActions.createUserFailure({ error })))
        )
      )
    )
  })

  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.editUser),
      concatMap((action) =>
        this.usersService.editUserById(action.id, action.payload).pipe(
          map(data => UsersActions.editUserSuccess({ data })),
          catchError(error => of(UsersActions.editUserFailure({ error })))
        )
      )
    )
  })

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      concatMap((action) =>
        this.usersService.deleteUserById(action.id).pipe(
          map(data => UsersActions.deleteUserSuccess({ data })),
          catchError(error => of(UsersActions.deleteUserFailure({ error })))
        )
      )
    )
  })


  constructor(private actions$: Actions, private usersService: UsersService) { }
}
