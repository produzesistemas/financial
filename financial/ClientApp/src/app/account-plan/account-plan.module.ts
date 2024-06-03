import { NgModule } from '@angular/core';
import { AccountPlanComponent } from './account-plan.component';
import { SharedModule } from '../shared.module';
import { AccountPlanRoutingModule} from './account-plan-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IConfig,NgxMaskModule } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        AccountPlanRoutingModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),

      ],
    declarations: [
      AccountPlanComponent
    ],
    exports: [ AccountPlanComponent
     ]
})
export class AccountPlanModule { }
