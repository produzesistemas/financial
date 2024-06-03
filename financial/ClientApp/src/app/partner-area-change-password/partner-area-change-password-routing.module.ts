import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaChangePasswordComponent } from './partner-area-change-password.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaChangePasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaChangePasswordRoutingModule { }
