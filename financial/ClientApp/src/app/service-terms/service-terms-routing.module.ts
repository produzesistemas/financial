import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceTermsComponent } from './service-terms.component';

const routes: Routes = [
    {
        path: '',
        component: ServiceTermsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceTermsRoutingModule { }