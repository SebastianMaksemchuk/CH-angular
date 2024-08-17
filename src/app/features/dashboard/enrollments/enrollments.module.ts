import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { EnrollmentsComponent } from './enrollments.component';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { SharedModule } from '../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { EnrollmentsEffects } from './store/enrollments.effects';



@NgModule({
  declarations: [
    EnrollmentsComponent,
    EnrollmentDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EnrollmentsRoutingModule,
    EffectsModule.forFeature([EnrollmentsEffects]),
  ],
  exports: [
    EnrollmentsComponent
  ]
})
export class EnrollmentsModule { }
