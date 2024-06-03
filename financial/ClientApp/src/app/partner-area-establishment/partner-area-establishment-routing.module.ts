import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaEstablishmentComponent } from './partner-area-establishment.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaEstablishmentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaEstablishmentRoutingModule { }
