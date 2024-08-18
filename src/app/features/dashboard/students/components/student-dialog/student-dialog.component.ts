import { Component, Inject } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../../../../shared/interfaces/student';

@Component({
  selector: 'cha-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})

export class StudentDialogComponent {

  studentForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<StudentDialogComponent>, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) public student?: Student
  ) {
    this.dateAdapter.setLocale('es-AR');
    this.matDialogRef.disableClose = true;
    this.studentForm = this.formBuilder.group({
      id: [],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      DOB: [new Date(), Validators.required],
      email: [null, { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
    });
    if (this.student) {
      this.studentForm.patchValue(this.student);
    }
  }

  onSubmit(): void {
    this.matDialogRef.close(this.studentForm.value);
  };

  onCancel(): void {
    this.matDialogRef.close();
  }
};
