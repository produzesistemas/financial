import { NgModule } from '@angular/core';
import { DeliveryRegionFormComponent } from './delivery-region-form.component';
import { SharedModule } from 'src/app/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from "ng2-currency-mask";

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
        CurrencyMaskModule

      ],
    declarations: [
      DeliveryRegionFormComponent
    ],
    exports: [ DeliveryRegionFormComponent,
     ]
})
export class DeliveryRegionFormModule { }
