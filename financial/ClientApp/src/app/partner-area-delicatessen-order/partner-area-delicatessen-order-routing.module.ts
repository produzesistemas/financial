import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaDelicatessenOrderFormComponent } from './partner-area-delicatessen-order-form/partner-area-delicatessen-order-form.component';
import { PartnerAreaDelicatessenOrderFormModule } from './partner-area-delicatessen-order-form/partner-area-delicatessen-order-form.module';
import { PartnerAreaDelicatessenOrderComponent } from './partner-area-delicatessen-order.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaDelicatessenOrderComponent
    },
    {
        path: ':id/:isEdit',
        component: PartnerAreaDelicatessenOrderFormComponent,
        children: [
            { path: 'partner-area-delicatessen-order-form', loadChildren: () => PartnerAreaDelicatessenOrderFormComponent },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaDelicatessenOrderRoutingModule { }
