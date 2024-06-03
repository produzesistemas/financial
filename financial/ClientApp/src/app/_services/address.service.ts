import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Address } from '../_model/address-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AddressService extends GenericHttpService<Address> {
    constructor(private http: HttpClient) {
        super(http);
    }

getAllAddress() {
    return this.http.get<Address[]>(`${this.getUrlApi()}address`);
}

update(entity: any) {
    return this.post('address/updateAddress', entity);
 }

 save(entity: any) {
    return this.post('address/save', entity);
 }

}
