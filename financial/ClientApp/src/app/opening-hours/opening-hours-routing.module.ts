import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpeningHoursComponent } from './opening-hours.component';
import { OpeningHoursFormComponent } from './opening-hours-form/opening-hours-form.component';
import { OpeningHoursFormModule } from './opening-hours-form/opening-hours-form.module';

const routes: Routes = [
    {
        path: '',
        component: OpeningHoursComponent
    },
    {
        path: ':id/:isEdit',
        component: OpeningHoursFormComponent,
        children: [
            { path: 'OpeningHoursForm', loadChildren: () => OpeningHoursFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpeningHoursRoutingModule { }
