import { Component, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../../../../shared/interfaces/course';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/interfaces/user';

@Component({
  selector: 'cha-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})

export class CourseDialogComponent {
  courseForm: FormGroup;
  teachers$: Observable<User[]>

  constructor(private formBuilder: FormBuilder, private matDialogRef: MatDialogRef<CourseDialogComponent>, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) public data: {course?: Course, teachers$: Observable<User[]>}
  ) {
    this.dateAdapter.setLocale('es-AR');
    this.matDialogRef.disableClose = true;
    this.teachers$ = data.teachers$;
    this.courseForm = this.formBuilder.group({
      id: [],
      comision: [null, Validators.required],
      name: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      classesCount: [null, Validators.required],
      duration: [null, Validators.required],
      teacherId: [null, Validators.required],
    }, { validators: this.dateRangeValidator });
    this.courseForm.get('startDate')?.valueChanges.subscribe(() => this.courseForm.updateValueAndValidity());
    this.courseForm.get('endDate')?.valueChanges.subscribe(() => this.courseForm.updateValueAndValidity());
    if (this.data.course) {
      this.courseForm.patchValue(this.data.course)
    };
  };

  dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    if (startDate && endDate && startDate > endDate) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    this.matDialogRef.close(this.courseForm.value)
  };

  onCancel(): void {
    this.matDialogRef.close();
  }
};
