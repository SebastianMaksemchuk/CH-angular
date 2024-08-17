import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';

import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StudentsEffects } from './store/students.effects';
import { StoreModule } from '@ngrx/store';
import { studentsFeature } from './store/students.reducer';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentDialogComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    StoreModule.forFeature(studentsFeature),
    EffectsModule.forFeature([StudentsEffects])
  ],
  exports: [StudentsComponent]
})
export class StudentsModule { }
