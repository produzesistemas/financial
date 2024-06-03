import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryFormModule } from './category-form/category-form.module';

const routes: Routes = [
    {
        path: '',
        component: CategoryComponent
    },
    {
        path: ':id/:isEdit',
        component: CategoryFormComponent,
        children: [
            { path: 'category-form', loadChildren: () => CategoryFormModule },
          ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
