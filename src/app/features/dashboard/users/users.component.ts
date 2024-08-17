import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../core/store/store';
import { UsersActions } from './store/users.actions';
import { Observable } from 'rxjs';
import { User } from '../../../shared/interfaces/user';
import { selectUsers, selectUsersError, selectUsersIsLoading } from './store/users.selectors';

@Component({
  selector: 'cha-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>
  isLoading$: Observable<boolean>
  error$: Observable<any>

  constructor(
    private store: Store<RootState>
  ) {
    this.users$ = this.store.select(selectUsers)
    this.isLoading$ = this.store.select(selectUsersIsLoading)
    this.error$ = this.store.select(selectUsersError)
  }

  ngOnInit(): void {
    this.store.dispatch(
      UsersActions.loadUsers()
    )
  }

  ngOnDestroy(): void {
    this.store.dispatch(
      UsersActions.unsetUsersState()
    );
  }

  reloadPage() {
    location.reload()
  }
}
