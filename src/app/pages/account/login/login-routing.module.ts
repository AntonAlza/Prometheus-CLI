import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login01Component } from './login01/login01.component';
import { Login02Component } from './login02/login02.component';
import { Login03Component } from './login03/login03.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login01',
        component: Login01Component
      },
      {
        path: 'login02',
        component: Login02Component
      },
      {
        path: 'login03',
        component: Login03Component
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }