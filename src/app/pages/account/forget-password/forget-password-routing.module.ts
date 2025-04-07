import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPassword01Component } from './forget-password01/forget-password01.component';
import { ForgetPassword02Component } from './forget-password02/forget-password02.component';
import { ForgetPassword03Component } from './forget-password03/forget-password03.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'forget-password01',
        component: ForgetPassword01Component
      },
      {
        path: 'forget-password02',
        component: ForgetPassword02Component
      },
      {
        path: 'forget-password03',
        component: ForgetPassword03Component
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgetPasswordRoutingModule { }