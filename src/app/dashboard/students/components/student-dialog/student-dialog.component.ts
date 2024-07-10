import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cha-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent {
  constructor(private matDialogRef: MatDialogRef<StudentDialogComponent>){
    matDialogRef.disableClose = true;
  }
}
