import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { PartnerAreaEstablishmentComponent } from './partner-area-establishment.component';
import { PartnerAreaEstablishmentRoutingModule } from './partner-area-establishment-routing.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PartnerAreaEstablishmentRoutingModule,
        NgxMaskModule.forRoot(maskConfig),
        NgbModule,
        CurrencyMaskModule
      ],
    declarations: [
      PartnerAreaEstablishmentComponent
    ],
    exports: [ PartnerAreaEstablishmentComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class PartnerAreaEstablishmentModule { }
