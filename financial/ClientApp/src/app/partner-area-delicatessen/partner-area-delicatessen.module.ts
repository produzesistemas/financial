import { NgModule } from '@angular/core';
import { PartnerAreaDelicatessenComponent } from './partner-area-delicatessen.component';
import { SharedModule } from '../shared.module';
import { PartnerAreaDelicatessenRoutingModule} from './partner-area-delicatessen-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        PartnerAreaDelicatessenRoutingModule,
        NgbModule
      ],
    declarations: [
        PartnerAreaDelicatessenComponent
    ],
    exports: [ PartnerAreaDelicatessenComponent ]
})
export class PartnerAreaDelicatessenModule { }
