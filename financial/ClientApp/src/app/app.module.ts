import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from '../app/_helpers/auth-Interceptor';
import { HttpRequestInterceptor } from '../app/_helpers/http-request.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { MainLayoutComponent } from '../app/_layouts/main-layout/main-layout.component';
import { MainHeaderComponent } from '../app/_layouts/main-header/main-header.component';
import { AdministratorLayoutComponent } from '../app/_layouts/administrator-layout/administrator-layout.component';
import { AdministratorHeaderComponent } from '../app/_layouts/administrator-header/administrator-header.component';
import { SharedModule } from './shared.module';
import { PartnerLayoutDeliveryComponent } from './_layouts/partner-layout-delivery/partner-layout-delivery.component';
import { PartnerHeaderDeliveryComponent } from './_layouts/partner-header-delivery/partner-header-delivery.component';

registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MainHeaderComponent,
    AdministratorLayoutComponent,
    AdministratorHeaderComponent,
    PartnerLayoutDeliveryComponent,
   PartnerHeaderDeliveryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // CurrencyPipe,
    BsModalService,
    BsModalRef,
    { provide: LOCALE_ID, useValue: 'pt' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
