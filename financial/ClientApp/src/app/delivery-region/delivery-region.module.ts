import { NgModule } from '@angular/core';
import { DeliveryRegionComponent } from './delivery-region.component';
import { SharedModule } from '../shared.module';
import { DeliveryRegionRoutingModule} from './delivery-region-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
    imports: [
        SharedModule,
        DeliveryRegionRoutingModule,
        CommonModule,
        NgbModule,
        NgxMaskModule.forRoot(maskConfig),
        CurrencyMaskModule
      ],
    declarations: [
      DeliveryRegionComponent
    ],
    exports: [ DeliveryRegionComponent
     ]
})
export class DeliveryRegionModule { }
