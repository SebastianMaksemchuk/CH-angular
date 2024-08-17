import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    CoursesModule,
    StudentsModule,
  ],
  exports: [DashboardComponent]
})

export class DashboardModule { };
