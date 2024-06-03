import { NgModule } from '@angular/core';
import { EstablishmentBrandComponent } from './establishment-brand.component';
import { SharedModule } from '../shared.module';
import { EstablishmentBrandRoutingModule} from './establishment-brand-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        SharedModule,
        EstablishmentBrandRoutingModule,
        CommonModule,
        NgbModule
      ],
    declarations: [
        EstablishmentBrandComponent
    ],
    exports: [ EstablishmentBrandComponent
     ]
})
export class EstablishmentBrandModule { }
