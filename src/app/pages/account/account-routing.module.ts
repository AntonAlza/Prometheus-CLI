import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comingsoon',
        component: ComingSoonComponent
      },
      {
        path: 'under-construction',
        component: UnderConstructionComponent
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }