import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalRoutingModule } from './global-routing.module';

import { FullNamePipe } from './pipes/full-name.pipe';
import { TitleDirective } from './directives/title.directive';

@NgModule({
  declarations: [
    FullNamePipe,
    TitleDirective,
  ],
  imports: [
    CommonModule,
    GlobalRoutingModule
  ],
  exports: [
    FullNamePipe,
    TitleDirective
  ]
})
export class GlobalModule { }
