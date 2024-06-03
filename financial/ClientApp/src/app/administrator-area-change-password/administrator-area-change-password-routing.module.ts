import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaChangePasswordComponent } from './administrator-area-change-password.component';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaChangePasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaChangePasswordRoutingModule { }
