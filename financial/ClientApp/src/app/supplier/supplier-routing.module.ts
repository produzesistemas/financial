import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierComponent } from './supplier.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierFormModule } from './supplier-form/supplier-form.module';

const routes: Routes = [
    {
        path: '',
        component: SupplierComponent
    },
    {
        path: ':id/:isEdit',
        component: SupplierFormComponent,
        children: [
            { path: '', loadChildren: () => SupplierFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupplierRoutingModule { }
