import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullNamePipe } from './pipes/full-name.pipe';
import { TitleDirective } from './directives/title.directive';
import { SharedImportsModule } from './utils/shared-imports.module';
import { RoleNamePipe } from './pipes/role-name.pipe';


@NgModule({
  declarations: [
    FullNamePipe,
    TitleDirective,
    RoleNamePipe
  ],
  imports: [
    CommonModule,
    SharedImportsModule
  ],
  exports: [
    FullNamePipe,
    RoleNamePipe,
    TitleDirective,
    SharedImportsModule
  ]
})
export class SharedModule { }
