import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/interfaces/user';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../core/store/store';
import { selectUsers, selectUsersError, selectUsersIsLoading } from '../../store/users.selectors';
import { UsersActions } from '../../store/users.actions';

@Component({
  selector: 'cha-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy{

  users$: Observable<User[]>
  isLoading$: Observable<boolean>
  error$: Observable<any>

  constructor(
    private store: Store<RootState>,
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
