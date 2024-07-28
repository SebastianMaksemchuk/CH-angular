import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullNamePipe } from './pipes/full-name.pipe';
import { TitleDirective } from './directives/title.directive';
import { SharedImportsModule } from './utils/shared-imports.module';


@NgModule({
  declarations: [
    FullNamePipe,
    TitleDirective
  ],
  imports: [
    CommonModule,
    SharedImportsModule
  ],
  exports: [
    FullNamePipe,
    TitleDirective
  ]
})
export class SharedModule { }
