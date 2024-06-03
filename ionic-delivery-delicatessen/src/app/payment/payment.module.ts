import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PaymentRoutingModule,
    MaskitoDirective,
  ],
  declarations: [PaymentPage]
})
export class PaymentModule {}
