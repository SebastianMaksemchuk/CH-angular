import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../../../global/interfaces/courses';

@Component({
  selector: 'cha-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {
courseForm: FormGroup;
constructor (private fb: FormBuilder, private matDialogRef: MatDialogRef<CourseDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public course?: Course 
) {
  this.matDialogRef.disableClose = true;
  this.courseForm = this.fb.group({
    name: [null,Validators.required],
    startDate: [],
    endDate: []
  });
if(this.course) {
  this.courseForm.patchValue(this.course)
}
}
onSubmit():void {
  this.matDialogRef.close(this.courseForm.value)
}
}
