import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacyPolicyEmporioJauaComponent } from './privacy-policy-emporio-jaua.component';

const routes: Routes = [
    {
        path: '',
        component: PrivacyPolicyEmporioJauaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyPolicyEmporioJauaRoutingModule { }