import { NgModule } from '@angular/core';
import { PartnerAreaChangePasswordComponent } from './partner-area-change-password.component';
import { SharedModule } from '../shared.module';
import { PartnerAreaChangePasswordRoutingModule} from './partner-area-change-password-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedModule,
        PartnerAreaChangePasswordRoutingModule,
        CommonModule,
      ],
    declarations: [
      PartnerAreaChangePasswordComponent
    ],
    exports: [ PartnerAreaChangePasswordComponent,
     ]
})
export class PartnerAreaChangePasswordModule { }
