import { NgModule } from '@angular/core';
import { AdministratorAreaEstablishmentComponent } from './administrator-area-establishment.component';
import { SharedModule } from '../shared.module';
import { AdministratorAreaEstablishmentRoutingModule} from './administrator-area-establishment-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        AdministratorAreaEstablishmentRoutingModule,
        NgbModule
      ],
    declarations: [
      AdministratorAreaEstablishmentComponent
    ],
    exports: [ AdministratorAreaEstablishmentComponent,
     ]
})
export class AdministratorAreaEstablishmentModule { }
