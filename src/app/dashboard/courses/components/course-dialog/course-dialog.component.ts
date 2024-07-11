import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../../../global/interfaces/courses';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'cha-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {
courseForm: FormGroup;
constructor (private formBuilder: FormBuilder, private matDialogRef: MatDialogRef<CourseDialogComponent>, private dateAdapter: DateAdapter<Date>,
  @Inject(MAT_DIALOG_DATA) public course?: Course 
) {
  this.dateAdapter.setLocale('es-AR')
  this.matDialogRef.disableClose = true;
  this.courseForm = this.formBuilder.group({
    id: [],
    comision: [null,Validators.required],
    name: [null, Validators.required],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(),Validators.required],
    studentQuota: [100,Validators.required],
    subscribedStudents: []
  });
if(this.course) {
  this.courseForm.patchValue(this.course)
}
}
onSubmit():void {
  this.matDialogRef.close(this.courseForm.value)
  console.log(this.courseForm.value)
}
}
