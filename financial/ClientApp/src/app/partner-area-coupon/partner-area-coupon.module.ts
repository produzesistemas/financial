import { NgModule } from '@angular/core';
import { PartnerAreaCouponComponent } from './partner-area-coupon.component';
import { SharedModule } from '../shared.module';
import { PartnerAreaCouponRoutingModule} from './partner-area-coupon-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerI18n , NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateAdapter, I18n  } from '../_adapters/custom-date-adapter';
import { CustomDateParserFormatter } from '../_adapters/custom-date-parser-formatter-adapter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PartnerAreaCouponRoutingModule,
        NgbModule,
        BsDatepickerModule.forRoot()
      ],
    declarations: [
        PartnerAreaCouponComponent
    ],
    exports: [ PartnerAreaCouponComponent,
        FormsModule,
        ReactiveFormsModule ],
        providers: [
         [I18n, { provide: NgbDatepickerI18n, useClass: CustomDateAdapter }],
         {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
       ]
})
export class PartnerAreaCouponModule { }
