import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageEmporioJauaComponent } from './page-emporio-jaua.component';

const routes: Routes = [
    {
        path: '',
        component: PageEmporioJauaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PageEmporioJauaRoutingModule { }