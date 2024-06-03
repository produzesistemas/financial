import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { State } from '../_model/state-model';
import { PostalCode } from '../_model/postal-code-model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PostalCodeService extends GenericHttpService<any> {
  constructor(private http: HttpClient) {
    super(http);
  }

  cauculationOfTotalShipping(entity: any) {
    return this.post('postalCode/cauculationOfTotalShipping', entity);
  }

  getShippingDeadline(filter: any) {
    return this.post('postalCode/getShippingDeadline', filter);
  }

  saveAddress(entity: any) {
    return this.post('postalCode/save', entity);
  }

  getAddress() {
    return this.http.get<PostalCode[]>(`${this.getUrlApi()}postalCode/getEndereco`);
  }

  getRightPostalCode(filter: any) {
    // return this.http.get<any>(`${this.getUrlApiCepCerto()}${url}`);
    return this.post('postalCode/getShippingDeadline', filter);
  }

}
