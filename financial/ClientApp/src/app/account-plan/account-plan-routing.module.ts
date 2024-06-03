import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountPlanComponent } from './account-plan.component';
import { AccountPlanFormComponent } from './account-plan-form/account-plan-form.component';
import { AccountPlanFormModule } from './account-plan-form/account-plan-form.module';

const routes: Routes = [
    {
        path: '',
        component: AccountPlanComponent
    },
    {
        path: ':id/:isEdit',
        component: AccountPlanFormComponent,
        children: [
            { path: 'account-plan-form', loadChildren: () => AccountPlanFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountPlanRoutingModule { }
