import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register01Component } from './register01/register01.component';
import { Register02Component } from './register02/register02.component';
import { Register03Component } from './register03/register03.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'register01',
        component: Register01Component
      },
      {
        path: 'register02',
        component: Register02Component
      },
      {
        path: 'register03',
        component: Register03Component
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }