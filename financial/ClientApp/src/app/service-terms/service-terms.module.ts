import { NgModule } from '@angular/core';
import { ServiceTermsRoutingModule} from './service-terms-routing.module';
import { CommonModule } from '@angular/common';
import { ServiceTermsComponent } from './service-terms.component';

@NgModule({
    imports: [
        CommonModule,
        ServiceTermsRoutingModule,
      ],
    declarations: [ ServiceTermsComponent],
    exports: [ ServiceTermsComponent]
})
export class ServiceTermsModule { }