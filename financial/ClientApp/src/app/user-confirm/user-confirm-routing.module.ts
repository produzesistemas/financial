import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserConfirmComponent } from './user-confirm.component';

const routes: Routes = [
    {
        path: '',
        component: UserConfirmComponent
    },
    {
        path: ':userid/:code',
        component: UserConfirmComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserConfirmRoutingModule { }