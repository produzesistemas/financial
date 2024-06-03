import { NgModule } from '@angular/core';
import { AdministratorAreaChangePasswordComponent } from './administrator-area-change-password.component';
import { SharedModule } from '../../app/shared.module';
import { AdministratorAreaChangePasswordRoutingModule} from './administrator-area-change-password-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedModule,
        AdministratorAreaChangePasswordRoutingModule,
        CommonModule,

      ],
    declarations: [
      AdministratorAreaChangePasswordComponent
    ],
    exports: [ AdministratorAreaChangePasswordComponent,
     ]
})
export class AdministratorAreaChangePasswordModule { }
