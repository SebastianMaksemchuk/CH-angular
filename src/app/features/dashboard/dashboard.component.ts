import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'cha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  showFiller = false;
  main: string = "start";
  authUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.authUser$ = this.authService.authUser$.pipe(tap(console.log));
  }

  changeTheme() {
    alert('modo oscuro aún no implementado');
  };

  logOut() {
    this.authService.logOut();
  }
};
