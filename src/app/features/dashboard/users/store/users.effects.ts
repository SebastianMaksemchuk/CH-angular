import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { UsersActions } from './users.actions';
import { UsersService } from '../../../../core/services/users.service';


@Injectable()
export class UsersEffects {

  loadUserss$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      concatMap(() =>
        this.usersService.getUsers().pipe(
          map(data => UsersActions.loadUsersSuccess({ data })),
          catchError(error => of(UsersActions.loadUsersFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions, private usersService: UsersService) { }
}
