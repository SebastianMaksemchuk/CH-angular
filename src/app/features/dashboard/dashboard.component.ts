import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { Store } from '@ngrx/store';
import { RootState } from '../../core/store/store';
import { selectAuthUser } from '../../core/store/auth/auth.selectors';

@Component({
  selector: 'cha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  showFiller = false;
  main: string = "start";
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private store: Store<RootState>) {
    this.authUser$ = this.store.select(selectAuthUser)
  }

  changeTheme() {
    alert('modo oscuro aún no implementado');
  };

  logOut() {
    this.authService.logOut();
  }
};
