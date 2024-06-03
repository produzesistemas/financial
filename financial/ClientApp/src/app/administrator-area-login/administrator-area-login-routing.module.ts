import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaLoginComponent } from './administrator-area-login.component';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaLoginComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaLoginRoutingModule { }
