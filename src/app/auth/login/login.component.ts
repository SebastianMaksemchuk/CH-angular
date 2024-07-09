import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cha-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
@Output() logIn = new EventEmitter()
}
