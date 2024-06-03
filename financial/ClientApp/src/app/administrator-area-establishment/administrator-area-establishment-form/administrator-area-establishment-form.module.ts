import { NgModule } from '@angular/core';
import { AdministratorAreaEstablishmentFormComponent } from './administrator-area-establishment-form.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgxMaskModule.forRoot(maskConfig),
        NgbModule
      ],
    declarations: [
      AdministratorAreaEstablishmentFormComponent
    ],
    exports: [ AdministratorAreaEstablishmentFormComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class AdministratorAreaEstablishmentFormModule { }
