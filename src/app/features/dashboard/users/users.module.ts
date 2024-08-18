import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UsersComponent } from './users.component';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './store/users.effects';
import { StoreModule } from '@ngrx/store';
import { usersFeature } from './store/users.reducer';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserDialogComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    StoreModule.forFeature(usersFeature),
    EffectsModule.forFeature([UsersEffects])
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
