import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared.module';
import { PartnerAreaDelicatessenOrderFormComponent } from './partner-area-delicatessen-order-form.component';
import { PostalCodePipeService } from '../../_services/postal-code.pipe.service';
import { PhonePipeService } from '../../_services/phone.pipe.service';
import { CpfPipeService } from '../../_services/cpf.pipe.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomDateAdapter, I18n } from 'src/app/_adapters/custom-date-adapter';
import { CustomDateParserFormatter } from 'src/app/_adapters/custom-date-parser-formatter-adapter';

@NgModule({
    imports: [
      SharedModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      BsDatepickerModule.forRoot(),
      NgbModule
      ],
    declarations: [
      PartnerAreaDelicatessenOrderFormComponent,
        PostalCodePipeService, 
        PhonePipeService,
        CpfPipeService
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        PartnerAreaDelicatessenOrderFormComponent ],
        providers: [
          [I18n, { provide: NgbDatepickerI18n, useClass: CustomDateAdapter }],
          {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
        ]
 
})
export class PartnerAreaDelicatessenOrderFormModule { }