import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { EnrollmentsComponent } from './enrollments.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    EnrollmentsComponent,
    EnrollmentDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EnrollmentsRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],
  exports: [
    EnrollmentsComponent
  ]
})
export class EnrollmentsModule { }
