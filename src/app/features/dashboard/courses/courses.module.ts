import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';

import { SharedModule } from '../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { CoursesEffects } from './store/courses.effects';
import { StoreModule } from '@ngrx/store';
import { coursesFeature } from './store/courses.reducer';


@NgModule({
  declarations: [
    CoursesComponent,
    CourseDialogComponent,
    CourseDetailComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    StoreModule.forFeature(coursesFeature),
    EffectsModule.forFeature([CoursesEffects])
  ],
  exports: [CoursesComponent]
})

export class CoursesModule { };
