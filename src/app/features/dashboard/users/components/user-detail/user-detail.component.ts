import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/interfaces/user';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../core/store/store';
import { selectSelectedUser, selectUsers, selectUsersError, selectUsersIsLoading } from '../../store/users.selectors';
import { UsersActions } from '../../store/users.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cha-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy{

  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  selectedUser$: Observable<User | null>;

  constructor(
    private store: Store<RootState>,
    private route: ActivatedRoute
  ) {
    this.users$ = this.store.select(selectUsers)
    this.isLoading$ = this.store.select(selectUsersIsLoading)
    this.error$ = this.store.select(selectUsersError)
    this.selectedUser$ = this.store.select(selectSelectedUser)
  };

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
    this.store.dispatch(UsersActions.loadUserById({id: this.route.snapshot.paramMap.get('id') ?? ""}))
  };

  ngOnDestroy(): void {
    this.store.dispatch(UsersActions.unsetUsersState());
  };

  reloadPage() {
    location.reload();
  };

}
