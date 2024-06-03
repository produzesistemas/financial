import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaLoginComponent } from './partner-area-login.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaLoginComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaLoginRoutingModule { }
