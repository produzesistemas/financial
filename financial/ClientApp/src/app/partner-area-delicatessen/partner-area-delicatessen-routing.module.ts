import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaDelicatessenComponent } from './partner-area-delicatessen.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaDelicatessenComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaDelicatessenRoutingModule { }
