import { NgModule } from '@angular/core';
import { PartnerAreaDelicatessenOrderComponent } from './partner-area-delicatessen-order.component';
import { SharedModule } from '../shared.module';
import { PartnerAreaDelicatessenOrderRoutingModule} from './partner-area-delicatessen-order-routing.module';
import { CommonModule } from '@angular/common';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomDateAdapter, I18n } from '../_adapters/custom-date-adapter';
import { CustomDateParserFormatter } from '../_adapters/custom-date-parser-formatter-adapter';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        PartnerAreaDelicatessenOrderRoutingModule,
        NgbModule,
        BsDatepickerModule.forRoot()
      ],
    declarations: [
        PartnerAreaDelicatessenOrderComponent
    ],
    exports: [ PartnerAreaDelicatessenOrderComponent ],
    providers: [
        [I18n, { provide: NgbDatepickerI18n, useClass: CustomDateAdapter }],
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
      ]

})
export class PartnerAreaDelicatessenOrderModule { }
