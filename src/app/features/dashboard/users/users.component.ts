import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../core/store/store';
import { UsersActions } from './store/users.actions';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../../shared/interfaces/user';
import { selectUsers, selectUsersError, selectUsersIsLoading } from './store/users.selectors';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { selectAuthUser } from '../../../core/store/auth/auth.selectors';
import { RoleNamePipe } from '../../../shared/pipes/role-name.pipe';

@Component({
  selector: 'cha-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'role', 'details', 'edit', 'delete'];

  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  authUser$: Observable<User | null>;
  filteredUsers$ = new BehaviorSubject<User[]>([]);

  constructor(
    private store: Store<RootState>,
    private matDialog: MatDialog,
    private roleNamePipe: RoleNamePipe
  ) {
    this.users$ = this.store.select(selectUsers);
    this.isLoading$ = this.store.select(selectUsersIsLoading);
    this.error$ = this.store.select(selectUsersError);
    this.authUser$ = this.store.select(selectAuthUser);
  };

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
    this.users$.subscribe(users => { this.filteredUsers$.next(users) });
  };

  ngOnDestroy(): void {
    this.store.dispatch(UsersActions.unsetUsersState());
  };

  reloadPage() {
    location.reload();
  };

  openUserDialog(user?: User): void {
    this.matDialog
      .open(UserDialogComponent, { data: user })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          if (!user) {
            this.store.dispatch(UsersActions.createUser({ payload: result }))
          } else {
            this.store.dispatch(UsersActions.editUser({ id: result.id, payload: result }))
          };
          this.resetFilter();
        };
      });
  };

  deleteUserById(id: string) {
    if (confirm('¿Está seguro que desea elminiar este usuario?')) {
      this.store.dispatch(UsersActions.deleteUser({ id: id }))
    };
  };

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.users$.pipe(
      map(users => users.filter(user =>
        user.firstName.toLowerCase().includes(filterValue) ||
        user.lastName.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue) ||
        this.roleNamePipe.transform(user.role).toLowerCase().includes(filterValue)
      ))
    ).subscribe(filtered => {
      this.filteredUsers$.next(filtered);
    });
  };

  resetFilter(): void {
    this.users$.subscribe(users => {
      this.filteredUsers$.next(users);
      const input = document.querySelector('#input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    });
  };

}
