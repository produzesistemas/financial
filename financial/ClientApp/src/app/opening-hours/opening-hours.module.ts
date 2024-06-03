import { NgModule } from '@angular/core';
import { OpeningHoursComponent } from './opening-hours.component';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpeningHoursRoutingModule } from './opening-hours-routing.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OpeningHoursRoutingModule,
        NgbModule
      ],
    declarations: [
        OpeningHoursComponent
    ],
    exports: [ OpeningHoursComponent,
        FormsModule,
        ReactiveFormsModule ]
})
export class OpeningHoursModule { }
