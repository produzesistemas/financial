import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderPage } from './order.page';
import { OrderPageRoutingModule } from './order-routing.module';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrderPageRoutingModule,
    MaskitoDirective,
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
