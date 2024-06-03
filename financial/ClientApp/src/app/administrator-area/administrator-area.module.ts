import { NgModule } from '@angular/core';
import { AdministratorAreaComponent } from './administrator-area.component';
import { SharedModule } from '../shared.module';
import { AdministratorAreaRoutingModule} from './administrator-area-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        AdministratorAreaRoutingModule,
        NgbModule
      ],
    declarations: [
        AdministratorAreaComponent
    ],
    exports: [ AdministratorAreaComponent ]
})
export class AdministratorAreaModule { }
