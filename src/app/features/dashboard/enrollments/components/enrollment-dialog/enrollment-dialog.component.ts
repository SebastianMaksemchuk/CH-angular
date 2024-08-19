import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Course } from '../../../../../shared/interfaces/course';
import { Student } from '../../../../../shared/interfaces/student';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cha-enrollment-dialog',
  templateUrl: './enrollment-dialog.component.html',
  styleUrl: './enrollment-dialog.component.scss'
})
export class EnrollmentDialogComponent {
  enrollmentForm: FormGroup;
  courses$: Observable<Course[]>;
  students$: Observable<Student[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnrollmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courses$: Observable<Course[]>, students$: Observable<Student[]> }
  ) {
    this.courses$ = data.courses$;
    this.students$ = data.students$;
    this.enrollmentForm = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required]
    });
    this.dialogRef.disableClose = true;
  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      this.dialogRef.close(this.enrollmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}