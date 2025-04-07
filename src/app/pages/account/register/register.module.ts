import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Register01Component } from './register01/register01.component';
import { Register02Component } from './register02/register02.component';
import { Register03Component } from './register03/register03.component';
import { RegisterRoutingModule } from './register-routing.module';



@NgModule({
  declarations: [
    Register01Component,
    Register02Component,
    Register03Component
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
