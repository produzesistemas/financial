import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import { SharedModule } from '../shared.module';
import { CategoryRoutingModule} from './category-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        SharedModule,
        CategoryRoutingModule,
        CommonModule,
        NgbModule
      ],
    declarations: [
      CategoryComponent
    ],
    exports: [ CategoryComponent
     ]
})
export class CategoryModule { }
