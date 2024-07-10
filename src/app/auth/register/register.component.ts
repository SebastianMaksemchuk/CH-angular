import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'cha-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  idIndex: number = 0;
  constructor(private formBuilder: FormBuilder, private matDialogRef: MatDialogRef<RegisterComponent>) {
    matDialogRef.disableClose = true;
    this.registerForm = this.formBuilder.group({
      id: [],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
      DOB: [null, Validators.required],
      role: [null, Validators.required],
      password: [null, {validators: [Validators.required, this.passwordValidator()], updateOn: 'blur'}],
    });
  }

  onSubmit(): void {
    this.registerForm.value['id'] = ++this.idIndex
    this.matDialogRef.close(this.registerForm.value)
    console.log(this.registerForm.value)
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key:string]:any} | null => {
      const value = control.value
      if (!value) {
        return null
      }
      const errors: any = {};

    if (!/[A-Z]+/.test(value)) {
      errors.upperCase = true;
    }
    if (!/[a-z]+/.test(value)) {
      errors.lowerCase = true;
    }
    if (!/[0-9]+/.test(value)) {
      errors.numeric = true;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]+/.test(value)) {
      errors.specialChar = true;
    }
    if (value.length < 8) {
      errors.minLength = true;
    }

    return Object.keys(errors).length ? errors : null;
    }
  }
}
