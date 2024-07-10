import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'cha-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
@Output() logIn = new EventEmitter()

constructor(private matDialog: MatDialog) { }
openRegisterDialog(): void {
  this.matDialog
  .open(RegisterComponent)
  .afterClosed()
  .subscribe({
    next: (value) => {
    }
  })
}
}
