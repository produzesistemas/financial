import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPage } from './account.page';
import { AccountPageRoutingModule } from './account-routing.module';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountPageRoutingModule,
    MaskitoDirective,
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
