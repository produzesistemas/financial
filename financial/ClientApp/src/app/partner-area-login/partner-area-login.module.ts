import { NgModule } from '@angular/core';
import { PartnerAreaLoginComponent } from './partner-area-login.component';
import { SharedModule } from '../shared.module';
import { PartnerAreaLoginRoutingModule} from '../partner-area-login/partner-area-login-routing.module';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        PartnerAreaLoginRoutingModule
      ],
    declarations: [
        PartnerAreaLoginComponent    ],
    exports: [ PartnerAreaLoginComponent ]
})
export class PartnerAreaLoginModule { }
