import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullNamePipe } from './pipes/full-name.pipe';
import { TitleDirective } from './directives/title.directive';
import { SharedImportsModule } from './utils/shared-imports.module';
import { RoleNamePipe } from './pipes/role-name.pipe';
import { FeatureNamePipe } from './pipes/feature-name.pipe';


@NgModule({
  declarations: [
    FullNamePipe,
    TitleDirective,
    RoleNamePipe,
    FeatureNamePipe
  ],
  imports: [
    CommonModule,
    SharedImportsModule
  ],
  exports: [
    FullNamePipe,
    RoleNamePipe,
    FeatureNamePipe,
    TitleDirective,
    SharedImportsModule
  ],
  providers: [
    RoleNamePipe
  ]
})
export class SharedModule { }
