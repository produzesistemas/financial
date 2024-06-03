import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyPostalCodePage } from './verify-postal-code.page';
import { VerifyPostalCodePageRoutingModule } from './verify-postal-code-routing.module';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerifyPostalCodePageRoutingModule,
    MaskitoDirective,
  ],
  declarations: [VerifyPostalCodePage]
})
export class VerifyPostalCodePageModule {}
