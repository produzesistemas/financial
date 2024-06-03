import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { MainRoutingModule} from './main-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared.module';

const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        MainRoutingModule,
        NgbModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
        MainComponent
    ],
    exports: [ MainComponent ]
})
export class MainModule { }
