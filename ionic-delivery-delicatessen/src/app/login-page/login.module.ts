import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login-page';
import { LoginRoutingModule } from './login-routing.module';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginRoutingModule,
    MaskitoDirective,
  ],
  declarations: [LoginPage]
})
export class LoginModule {}
