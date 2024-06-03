import { NgModule } from '@angular/core';
import { SupplierFormComponent } from './supplier-form.component';
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
        SupplierFormComponent
    ],
    exports: [ SupplierFormComponent,
     ]
})
export class SupplierFormModule { }
