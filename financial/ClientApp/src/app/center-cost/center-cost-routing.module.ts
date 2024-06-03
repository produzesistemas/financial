import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterCostComponent } from './center-cost.component';
import { CenterCostFormComponent } from './center-cost-form/center-cost-form.component';
import { CenterCostFormModule } from './center-cost-form/center-cost-form.module';

const routes: Routes = [
    {
        path: '',
        component: CenterCostComponent
    },
    {
        path: ':id/:isEdit',
        component: CenterCostFormComponent,
        children: [
            { path: '', loadChildren: () => CenterCostFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CenterCostRoutingModule { }
