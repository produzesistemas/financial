import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaSubscriptionComponent } from './administrator-area-subscription.component';
import { AdministratorAreaSubscriptionFormComponent } from './administrator-area-subscription-form/administrator-area-subscription-form.component';
import { AdministratorAreaSubscriptionFormModule } from './administrator-area-subscription-form/administrator-area-subscription-form.module';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaSubscriptionComponent
    },
    {
        path: ':id/:isEdit',
        component: AdministratorAreaSubscriptionFormComponent,
        children: [
            { path: 'administratorAreaSubscriptionForm', loadChildren: () => AdministratorAreaSubscriptionFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaSubscriptionRoutingModule { }
