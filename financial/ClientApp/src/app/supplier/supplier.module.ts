import { NgModule } from '@angular/core';
import { SupplierComponent } from './supplier.component';
import { SharedModule } from '../shared.module';
import { SupplierRoutingModule} from './supplier-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
    imports: [
        SharedModule,
        SupplierRoutingModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
      SupplierComponent
    ],
    exports: [ SupplierComponent
     ]
})
export class SupplierModule { }
