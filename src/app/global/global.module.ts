import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalRoutingModule } from './global-routing.module';

import { FullNamePipe } from './pipes/full-name.pipe';


@NgModule({
  declarations: [
    FullNamePipe
  ],
  imports: [
    CommonModule,
    GlobalRoutingModule
  ],
  exports: [
    FullNamePipe]
})
export class GlobalModule { }
