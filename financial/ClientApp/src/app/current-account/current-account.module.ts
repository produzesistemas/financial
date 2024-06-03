import { NgModule } from '@angular/core';
import { CurrentAccountComponent } from './current-account.component';
import { SharedModule } from '../shared.module';
import { CurrentAccountRoutingModule} from './current-account-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        SharedModule,
        CurrentAccountRoutingModule,
        CommonModule,
        NgbModule
      ],
    declarations: [
      CurrentAccountComponent
    ],
    exports: [ CurrentAccountComponent
     ]
})
export class CurrentAccountModule { }
