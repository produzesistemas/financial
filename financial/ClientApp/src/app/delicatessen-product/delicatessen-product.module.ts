import { NgModule } from '@angular/core';
import { DelicatessenProductComponent } from './delicatessen-product.component';
import { SharedModule } from '../shared.module';
import { DelicatessenProductRoutingModule} from './delicatessen-product-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DelicatessenProductRoutingModule,
        NgbModule
      ],
    declarations: [
        DelicatessenProductComponent
    ],
    exports: [ DelicatessenProductComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class DelicatessenProductModule { }
