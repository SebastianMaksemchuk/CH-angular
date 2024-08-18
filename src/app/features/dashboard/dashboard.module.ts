import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { SharedModule } from '../../shared/shared.module';
import { UsersModule } from './users/users.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    CoursesModule,
    StudentsModule,
    UsersModule,
    EnrollmentsModule
  ],
  exports: [DashboardComponent]
})

export class DashboardModule { };
