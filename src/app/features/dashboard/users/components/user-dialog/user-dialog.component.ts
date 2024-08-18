import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, UserRole } from '../../../../../shared/interfaces/user';

@Component({
  selector: 'cha-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  userForm: FormGroup;
  userRoles: UserRole[] = ['ADMIN', 'TEACHER'];

  constructor(
    private formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user?: User
  ) {
    this.userForm = this.formBuilder.group({
      id: [],
      firstName: [null, { validators: [Validators.required, Validators.pattern(`^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+([ '-][a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$`)], updateOn: 'blur' }],
      lastName: [null, Validators.pattern(`^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+([ '-][a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$`)],
      email: [null, { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
      password: [null, { validators: [Validators.required, this.passwordValidator()], updateOn: 'blur' }],
      role: ['TEACHER', Validators.required],
      token: []
    });
    if (this.user) { this.userForm.patchValue(this.user); }
    this.matDialogRef.disableClose = true;
  }

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
    };
  };

  onSubmit(): void {
    this.matDialogRef.close(this.userForm.value);
  };
}
