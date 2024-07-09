import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cha-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  showFiller = false;
  main: string = "start"
  @Output() logOut = new EventEmitter;
}
