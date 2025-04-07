import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPassword01Component } from './reset-password01/reset-password01.component';
import { ResetPassword02Component } from './reset-password02/reset-password02.component';
import { ResetPassword03Component } from './reset-password03/reset-password03.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reset-password01',
        component: ResetPassword01Component
      },
      {
        path: 'reset-password02',
        component: ResetPassword02Component
      },
      {
        path: 'reset-password03',
        component: ResetPassword03Component
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule { }