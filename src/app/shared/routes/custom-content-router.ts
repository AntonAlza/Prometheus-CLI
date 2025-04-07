import { Routes } from '@angular/router';

export const custom_content: Routes = [
  {
    path: 'custom-pages',
    loadChildren: () => import('../../pages/account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'custom-pages/login',
    loadChildren: () => import('../../pages/account/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'custom-pages/register',
    loadChildren: () => import('../../pages/account/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'custom-pages/forget-password',
    loadChildren: () => import('../../pages/account/forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
  },
  {
    path: 'custom-pages/reset-password',
    loadChildren: () => import('../../pages/account/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'custom-pages/lockscreen',
    loadChildren: () => import('../../pages/account/lock-screen/lock-screen.module').then(m => m.LockScreenModule)
  },

  // REDIRECCIONAR FORGOT PASSWORD
  // {
  //   path: 'custom-pages/forgot-password',
  //   loadChildren: () => import('../../authentication/login-page/forgot-password.module').then(m => m.ForgotPasswordModule)
  // }
]