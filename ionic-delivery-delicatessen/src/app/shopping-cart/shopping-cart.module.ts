import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartPage } from './shopping-cart.page';
import { ShoppingCartPageRoutingModule } from './shopping-cart-routing.module';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShoppingCartPageRoutingModule,
    MaskitoDirective,
  ],
  declarations: [ShoppingCartPage]
})
export class ShoppingCartPageModule {}
