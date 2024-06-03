import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../app/_guard/auth.guard';
import { MainLayoutComponent } from './_layouts/main-layout/main-layout.component';
import { MainModule } from './main/main.module';
import { AdministratorAreaLoginModule } from './administrator-area-login/administrator-area-login.module';
import { AdministratorLayoutComponent } from './_layouts/administrator-layout/administrator-layout.component';
import { AdministratorAreaModule } from './administrator-area/administrator-area.module';
import { AdministratorAreaEstablishmentModule } from './administrator-area-establishment/administrator-area-establishment.module';
import { UserConfirmModule } from './user-confirm/user-confirm.module';
import { AdministratorAreaChangePasswordModule } from './administrator-area-change-password/administrator-area-change-password.module';
import { AdministratorAreaLogModule } from './administrator-area-log/administrator-area-log.module';
import { PartnerLayoutDeliveryComponent } from './_layouts/partner-layout-delivery/partner-layout-delivery.component';
import { PartnerAreaLoginModule } from './partner-area-login/partner-area-login.module';
import { PartnerAreaDelicatessenModule } from './partner-area-delicatessen/partner-area-delicatessen.module';
import { AdministratorAreaSubscriptionModule } from './administrator-area-subscription/administrator-area-subscription.module';
import { DeliveryRegionModule } from './delivery-region/delivery-region.module';
import { OpeningHoursModule } from './opening-hours/opening-hours.module';
import { PartnerAreaEstablishmentModule } from './partner-area-establishment/partner-area-establishment.module';
import { CategoryModule } from './category/category.module';
import { DelicatessenProductModule } from './delicatessen-product/delicatessen-product.module';
import { PartnerAreaChangePasswordModule } from './partner-area-change-password/partner-area-change-password.module';
import { PartnerAreaCouponModule } from './partner-area-coupon/partner-area-coupon.module';
import { PartnerAreaDelicatessenOrderModule } from './partner-area-delicatessen-order/partner-area-delicatessen-order.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { ServiceTermsModule } from './service-terms/service-terms.module';
import { EstablishmentBrandModule } from './establishment-brand/establishment-brand.module';
import { PrivacyPolicyEmporioJauaModule } from './privacy-policy-emporio-jaua/privacy-policy-emporio-jaua.module';
import { PrivacyPolicyEmporioJauaComponent } from './privacy-policy-emporio-jaua/privacy-policy-emporio-jaua.component';
import { ServiceTermsComponent } from './service-terms/service-terms.component';
import { PageEmporioJauaComponent } from './page-emporio-jaua/page-emporio-jaua.component';
import { PageEmporioJauaModule } from './page-emporio-jaua/page-emporio-jaua.module';
import { DeleteAccountModule } from './delete-account/delete-account.module';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', loadChildren: () => MainModule },
      { path: 'administrator-area-login', loadChildren: () => AdministratorAreaLoginModule },
      { path: 'partner-area-login', loadChildren: () => PartnerAreaLoginModule },
      { path: 'user-confirm', loadChildren: () => UserConfirmModule },
      { path: 'privacy-policy', loadChildren: () => PrivacyPolicyModule },
      { path: 'delete-account', loadChildren: () => DeleteAccountModule }
    ]
  },
  {
    path: '',
    component: PrivacyPolicyEmporioJauaComponent,
    children: [
      { path: 'privacy-policy-emporio-jaua', loadChildren: () => PrivacyPolicyEmporioJauaModule },
    ]
  },
  {
    path: '',
    component: ServiceTermsComponent,
    children: [
      { path: 'service-terms-emporio-jaua', loadChildren: () => ServiceTermsModule },
    ]
  },
  {
    path: '',
    component: PageEmporioJauaComponent,
    children: [
      { path: 'page-emporio-jaua', loadChildren: () => PageEmporioJauaModule },
    ]
  },
  {
    path: '',
    component: AdministratorLayoutComponent,
    children: [
      { path: 'administrator-area', loadChildren: () => AdministratorAreaModule },
      { path: 'administrator-area-establishment', loadChildren: () => AdministratorAreaEstablishmentModule },
      { path: 'administrator-area-subscription', loadChildren: () => AdministratorAreaSubscriptionModule },
      { path: 'administrator-area-log', loadChildren: () => AdministratorAreaLogModule },
      { path: 'administrator-area-change-password', loadChildren: () => AdministratorAreaChangePasswordModule },
     ],
     canActivate: [AuthGuard],
     data: { expectedRole: ['Administrador'] }
  },

  {
    path: '',
    component: PartnerLayoutDeliveryComponent,
    children: [
      { path: 'partner-area-delicatessen', loadChildren: () => PartnerAreaDelicatessenModule },
      { path: 'partner-area-delicatessen-order', loadChildren: () => PartnerAreaDelicatessenOrderModule },
      { path: 'partner-area-coupon', loadChildren: () => PartnerAreaCouponModule },
      { path: 'delicatessen-product', loadChildren: () => DelicatessenProductModule },
      { path: 'establishment-brand', loadChildren: () => EstablishmentBrandModule },
      { path: 'category', loadChildren: () => CategoryModule },
      { path: 'delivery-region', loadChildren: () => DeliveryRegionModule },
      { path: 'opening-hours', loadChildren: () => OpeningHoursModule },
      { path: 'partner-area-establishment', loadChildren: () => PartnerAreaEstablishmentModule },
      { path: 'partner-area-change-password', loadChildren: () => PartnerAreaChangePasswordModule },
     ],
     canActivate: [AuthGuard],
     data: { expectedRole: ['Delicatessen'] }
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
