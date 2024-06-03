import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryRegionComponent } from './delivery-region.component';
import { DeliveryRegionFormComponent } from './delivery-region-form/delivery-region-form.component';
import { DeliveryRegionFormModule } from './delivery-region-form/delivery-region-form.module';

const routes: Routes = [
    {
        path: '',
        component: DeliveryRegionComponent
    },
    {
        path: ':id/:isEdit',
        component: DeliveryRegionFormComponent,
        children: [
            { path: 'delivery-region-form', loadChildren: () => DeliveryRegionFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryRegionRoutingModule { }
