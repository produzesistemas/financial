import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstablishmentBrandComponent } from './establishment-brand.component';

const routes: Routes = [
    {
        path: '',
        component: EstablishmentBrandComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EstablishmentBrandRoutingModule { }
