import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared.module';
import { DeleteAccountRoutingModule } from './delete-account-routing.module';
import { DeleteAccountComponent } from './delete-account.component';

const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        DeleteAccountRoutingModule,
        NgbModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
      DeleteAccountComponent
    ],
    exports: [ DeleteAccountComponent ]
})
export class DeleteAccountModule { }
