import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { Store } from '@ngrx/store';
import { RootState } from '../../core/store/store';
import { selectAuthUser } from '../../core/store/auth/auth.selectors';
import { DashboardActions } from '../../core/store/dashboard/dashboard.actions';
import { selectDashboardMainFeature } from '../../core/store/dashboard/dashboard.selectors';

@Component({
  selector: 'cha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  showFiller = false;
  currentFeature$: Observable<string>;
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private store: Store<RootState>) {
    this.authUser$ = this.store.select(selectAuthUser)
    this.currentFeature$ = this.store.select(selectDashboardMainFeature)
  }

  changeFeatuerTitle(featureTitle: string) {
    this.store.dispatch(DashboardActions.setDashboardMainFeature({payload: featureTitle}))
  }

  logOut() {
    this.authService.logOut();
  }
};
