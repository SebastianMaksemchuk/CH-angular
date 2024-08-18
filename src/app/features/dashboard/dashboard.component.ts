import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
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
  main: string = "home";
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private store: Store<RootState>) {
    this.authUser$ = this.store.select(selectAuthUser)
  }

  logOut() {
    this.authService.logOut();
  }
};
