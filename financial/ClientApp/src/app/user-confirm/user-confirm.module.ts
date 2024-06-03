import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { UserConfirmRoutingModule } from './user-confirm-routing.module';
import { UserConfirmComponent } from './user-confirm.component';

@NgModule({
    imports: [
        CommonModule,
        UserConfirmRoutingModule,
        SharedModule
    ],
    declarations: [UserConfirmComponent],
    entryComponents: []
})
export class UserConfirmModule {}