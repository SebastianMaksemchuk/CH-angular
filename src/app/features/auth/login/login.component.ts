import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RegisterComponent } from '../register/register.component';

import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cha-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private matDialog: MatDialog) {

    this.logInForm = this.formBuilder.group({
      email: [null, { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
      password: [null, { validators: [Validators.required, this.passwordValidator()], updateOn: 'blur' }],
    });
  };

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) { return null };
      const errors: any = {};
      if (!/[A-Z]+/.test(value)) { errors.upperCase = true; };
      if (!/[a-z]+/.test(value)) { errors.lowerCase = true; };
      if (!/[0-9]+/.test(value)) { errors.numeric = true; };
      if (!/[!@#$%^&*(),.?":{}|<>]+/.test(value)) { errors.specialChar = true; };
      if (value.length < 8) { errors.minLength = true; };
      return Object.keys(errors).length ? errors : null;
    }
  }

  openRegisterDialog(): void {
    this.matDialog
      .open(RegisterComponent)
      .afterClosed()
      .subscribe({
        next: (value) => {
        }
      });
  };
};
