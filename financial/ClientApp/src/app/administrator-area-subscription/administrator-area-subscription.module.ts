import { NgModule } from '@angular/core';
import { AdministratorAreaSubscriptionComponent } from './administrator-area-subscription.component';
import { SharedModule } from '../shared.module';
import { AdministratorAreaSubscriptionRoutingModule} from './administrator-area-subscription-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerI18n , NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateAdapter, I18n  } from '../_adapters/custom-date-adapter';
import { CustomDateParserFormatter } from '../_adapters/custom-date-parser-formatter-adapter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdministratorAreaSubscriptionRoutingModule,
        NgbModule,
        BsDatepickerModule.forRoot()
      ],
    declarations: [
        AdministratorAreaSubscriptionComponent
    ],
    exports: [ AdministratorAreaSubscriptionComponent,
        FormsModule,
        ReactiveFormsModule ],
        providers: [
         [I18n, { provide: NgbDatepickerI18n, useClass: CustomDateAdapter }],
         {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
       ]
})
export class AdministratorAreaSubscriptionModule { }
