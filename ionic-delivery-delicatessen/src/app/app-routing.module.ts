import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'products',
        loadChildren: () => import('./product/product.module').then( m => m.ProductModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then( m => m.AboutModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
      },
      {
        path: 'order-detail/:id',
        loadChildren: () => import('./order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: 'shopping-cart',
        loadChildren: () => import('./shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
      },
    ]
    },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'close-order',
    loadChildren: () => import('./close-order/close-order.module').then( m => m.CloseOrderModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentModule)
  },
  {
    path: 'verify-postal-code',
    loadChildren: () => import('./verify-postal-code/verify-postal-code.module').then( m => m.VerifyPostalCodePageModule)
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login.module').then( m => m.LoginModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
