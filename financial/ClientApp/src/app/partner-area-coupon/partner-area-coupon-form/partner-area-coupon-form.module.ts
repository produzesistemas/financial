import { NgModule } from '@angular/core';
import { PartnerAreaCouponFormComponent } from './partner-area-coupon-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CurrencyMaskModule } from "ng2-currency-mask";


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        CurrencyMaskModule,
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        NgbModule
      ],
    declarations: [
        PartnerAreaCouponFormComponent
    ],
    exports: [ PartnerAreaCouponFormComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class PartnerAreaCouponFormModule { }
