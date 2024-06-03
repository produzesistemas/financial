import { NgModule } from '@angular/core';
import { OpeningHoursFormComponent } from './opening-hours-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { IConfig, NgxMaskModule } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
    validation: false,
  };
  

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgxMaskModule.forRoot(maskConfig),
        CurrencyMaskModule
      ],
    declarations: [
        OpeningHoursFormComponent
    ],
    exports: [ OpeningHoursFormComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class OpeningHoursFormModule { }
