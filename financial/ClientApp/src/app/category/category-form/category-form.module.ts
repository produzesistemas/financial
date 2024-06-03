import { NgModule } from '@angular/core';
import { CategoryFormComponent } from './category-form.component';
import { SharedModule } from 'src/app/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        NgbModule,
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
      ],
    declarations: [
      CategoryFormComponent
    ],
    exports: [ CategoryFormComponent,
     ]
})
export class CategoryFormModule { }
