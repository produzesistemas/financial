import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorAreaLogComponent } from './administrator-area-log.component';

const routes: Routes = [
    {
        path: '',
        component: AdministratorAreaLogComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorAreaLogRoutingModule { }
