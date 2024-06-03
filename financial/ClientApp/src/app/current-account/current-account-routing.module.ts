import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentAccountComponent } from './current-account.component';
import { CurrentAccountFormComponent } from './current-account-form/current-account-form.component';
import { CurrentAccountFormModule } from './current-account-form/current-account-form.module';

const routes: Routes = [
    {
        path: '',
        component: CurrentAccountComponent
    },
    {
        path: ':id/:isEdit',
        component: CurrentAccountFormComponent,
        children: [
            { path: 'current-account-form', loadChildren: () => CurrentAccountFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CurrentAccountRoutingModule { }
