import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaCouponComponent } from './partner-area-coupon.component';
import { PartnerAreaCouponFormComponent } from './partner-area-coupon-form/partner-area-coupon-form.component';
import { PartnerAreaCouponFormModule } from './partner-area-coupon-form/partner-area-coupon-form.module';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaCouponComponent
    },
    {
        path: ':id/:isEdit',
        component: PartnerAreaCouponFormComponent,
        children: [
            { path: 'partner-area-coupon-form', loadChildren: () => PartnerAreaCouponFormComponent },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaCouponRoutingModule { }
