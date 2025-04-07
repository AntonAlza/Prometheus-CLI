import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AccountRoutingModule } from './account-routing.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ForgetPasswordModule } from './forget-password/forget-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { LockScreenModule } from './lock-screen/lock-screen.module';



@NgModule({
  declarations: [
    UnderConstructionComponent,
    ComingSoonComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    LoginModule,
    RegisterModule,
    ForgetPasswordModule,
    ResetPasswordModule,
    LockScreenModule
  ]
})
export class AccountModule { }
