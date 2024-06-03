import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaEstablishmentFormComponent } from './administrator-area-establishment-form/administrator-area-establishment-form.component';
import { AdministratorAreaEstablishmentFormModule } from './administrator-area-establishment-form/administrator-area-establishment-form.module';
import { AdministratorAreaEstablishmentComponent } from './administrator-area-establishment.component';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaEstablishmentComponent
    },
    {
        path: ':id/:isEdit',
        component: AdministratorAreaEstablishmentFormComponent,
        children: [
            { path: '', loadChildren: () => AdministratorAreaEstablishmentFormModule },
          ]
      },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaEstablishmentRoutingModule { }
