import { NgModule } from '@angular/core';
import { PrivacyPolicyEmporioJauaRoutingModule} from './privacy-policy-emporio-jaua-routing.module';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyEmporioJauaComponent } from './privacy-policy-emporio-jaua.component';

@NgModule({
    imports: [
        CommonModule,
        PrivacyPolicyEmporioJauaRoutingModule,
      ],
    declarations: [ PrivacyPolicyEmporioJauaComponent],
    exports: [ PrivacyPolicyEmporioJauaComponent]
})
export class PrivacyPolicyEmporioJauaModule { }