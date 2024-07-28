import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';

import { SharedModule } from '../../../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CourseDialogComponent,
    CourseDetailComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  exports: [CoursesComponent]
})

export class CoursesModule { };
