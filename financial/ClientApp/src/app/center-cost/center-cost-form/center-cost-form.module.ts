import { NgModule } from '@angular/core';
import { CenterCostFormComponent } from './center-cost-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';

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
      CenterCostFormComponent
    ],
    exports: [CenterCostFormComponent,
     ]
})
export class CenterCostFormModule { }
