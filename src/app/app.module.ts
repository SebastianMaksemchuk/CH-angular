import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';

import { provideNativeDateAdapter } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    AuthModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter()
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
