import { NgModule } from '@angular/core';
import { AccountPlanFormComponent } from './account-plan-form.component';
import { SharedModule } from 'src/app/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
      AccountPlanFormComponent
    ],
    exports: [ AccountPlanFormComponent,
     ]
})
export class AccountPlanFormModule { }
