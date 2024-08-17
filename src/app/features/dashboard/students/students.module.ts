import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentDialogComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule
  ],
  exports: [StudentsComponent]
})
export class StudentsModule { }
