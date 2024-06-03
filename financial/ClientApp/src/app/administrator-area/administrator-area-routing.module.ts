import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaComponent } from './administrator-area.component';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaRoutingModule { }
