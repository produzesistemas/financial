import { NgModule } from '@angular/core';
import { CenterCostComponent } from './center-cost.component';
import { SharedModule } from '../shared.module';
import { CenterCostRoutingModule} from './center-cost-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
    imports: [
        SharedModule,
        CenterCostRoutingModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
      CenterCostComponent
    ],
    exports: [ CenterCostComponent
     ]
})
export class CenterCostModule { }
