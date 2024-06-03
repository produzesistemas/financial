import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelicatessenProductComponent } from './delicatessen-product.component';
import { DelicatessenProductFormComponent } from './delicatessen-product-form/delicatessen-product-form.component';
import { DelicatessenProductFormModule } from './delicatessen-product-form/delicatessen-product-form.module';

const routes: Routes = [
    {
        path: '',
        component: DelicatessenProductComponent
    },
    {
        path: ':id/:isEdit',
        component: DelicatessenProductFormComponent,
        children: [
            { path: 'delicatessenProductForm', loadChildren: () => DelicatessenProductFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DelicatessenProductRoutingModule { }
