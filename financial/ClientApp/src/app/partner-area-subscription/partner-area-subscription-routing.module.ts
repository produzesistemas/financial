import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerAreaSubscriptionComponent } from './partner-area-subscription.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerAreaSubscriptionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerAreaSubscriptionRoutingModule { }
