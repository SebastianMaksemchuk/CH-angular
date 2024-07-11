import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  showFiller = false;

  // variable temporal que define que componente se muestra en el main del dashboard
  main: string = "start";

  @Output() logOut = new EventEmitter;

  changeTheme() {
    alert('modo oscuro aún no implementado');
  };
};
