import { NgModule } from '@angular/core';
import { CurrentAccountFormComponent } from './current-account-form.component';
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
      CurrentAccountFormComponent
    ],
    exports: [ CurrentAccountFormComponent,
     ]
})
export class CurrentAccountFormModule { }
