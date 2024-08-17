import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../core/store/store';
import { UsersActions } from './store/users.actions';
import { Observable } from 'rxjs';
import { User } from '../../../shared/interfaces/user';
import { selectUsers, selectUsersError, selectUsersIsLoading } from './store/users.selectors';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';

@Component({
  selector: 'cha-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'role', 'details', 'edit', 'delete'];

  users$: Observable<User[]>
  isLoading$: Observable<boolean>
  error$: Observable<any>

  constructor(
    private store: Store<RootState>,
    private matDialog: MatDialog
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

  openUserDialog(usuario?: User) : void {
    this.matDialog
    .open(UserDialogComponent, {data: usuario})
    .afterClosed()
    .subscribe( result => {
      if (!usuario && result) {
        this.store.dispatch(UsersActions.createUser({payload: result}))
      }
      if (usuario) {
        this.store.dispatch(UsersActions.editUser({id: result.id, payload: result}))
      }
    })
  }

  deleteUserById(id: string) {
    if (confirm('¿Está seguro que desea elminiar este usuario?')) {
      this.store.dispatch(UsersActions.deleteUser({id: id}))
    }
  }

}
