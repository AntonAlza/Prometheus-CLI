import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login01Component } from './login01/login01.component';
import { Login02Component } from './login02/login02.component';
import { Login03Component } from './login03/login03.component';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({
  declarations: [
    Login01Component,
    Login02Component,
    Login03Component
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
