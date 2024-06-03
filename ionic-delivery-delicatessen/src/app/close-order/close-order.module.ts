import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloseOrderRoutingModule } from './close-order-routing.module';

import { CloseOrderPage } from './close-order.page';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CloseOrderRoutingModule,
    MaskitoDirective,
  ],
  declarations: [CloseOrderPage]
})
export class CloseOrderModule {}
