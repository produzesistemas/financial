import { NgModule } from '@angular/core';
import { AdministratorAreaSubscriptionFormComponent } from './administrator-area-subscription-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        NgbModule,
        CurrencyMaskModule
      ],
    declarations: [
        AdministratorAreaSubscriptionFormComponent
    ],
    exports: [ AdministratorAreaSubscriptionFormComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class AdministratorAreaSubscriptionFormModule { }
