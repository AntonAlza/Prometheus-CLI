import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockScreen01Component } from './lock-screen01/lock-screen01.component';
import { LockScreen02Component } from './lock-screen02/lock-screen02.component';
import { LockScreen03Component } from './lock-screen03/lock-screen03.component';
import { LockScreenRoutingModule } from './lock-screen-routing.module';



@NgModule({
  declarations: [
    LockScreen01Component,
    LockScreen02Component,
    LockScreen03Component
  ],
  imports: [
    CommonModule,
    LockScreenRoutingModule
  ]
})
export class LockScreenModule { }
