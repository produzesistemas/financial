import { NgModule } from '@angular/core';
import { AdministratorAreaLogComponent } from './administrator-area-log.component';
import { SharedModule } from '../shared.module';
import { AdministratorAreaLogRoutingModule} from './administrator-area-log-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdministratorAreaLogRoutingModule,
        NgbModule
      ],
    declarations: [
        AdministratorAreaLogComponent
    ],
    exports: [ AdministratorAreaLogComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class AdministratorAreaLogModule { }
