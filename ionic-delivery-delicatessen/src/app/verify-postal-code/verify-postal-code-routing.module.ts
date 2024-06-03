import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyPostalCodePage } from './verify-postal-code.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyPostalCodePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyPostalCodePageRoutingModule {}
