import { NgModule } from '@angular/core';
import { DelicatessenProductFormComponent } from './delicatessen-product-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CurrencyMaskModule
      ],
    declarations: [
        DelicatessenProductFormComponent
    ],
    exports: [ DelicatessenProductFormComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class DelicatessenProductFormModule { }
