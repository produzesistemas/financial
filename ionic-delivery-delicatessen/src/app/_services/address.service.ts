import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericHttpService } from './genericHttpService';
import { Preferences } from '@capacitor/preferences';
import { LoginUser } from '../_models/login-user-model';
import { Address } from '../_models/address-model';

@Injectable({ providedIn: 'root' })
export class AddressService extends GenericHttpService<Address>{
    protected baseUrl = `${environment.urlApi}`;
    protected baseSite = `${environment.urlApi}`;

    constructor(private http: HttpClient) {
        super(http);
    }

    
  save(address: Address) {
    return this.post('address/save', address);
}

async insert(address: Address) {
  await Preferences.remove({ key: 'last-address' });
  await Preferences.set({ key: 'last-address', value: JSON.stringify(address) });
}

async getLastAddress() {
  const ret = await Preferences.get({ key: 'last-address' });
  return JSON.parse(ret.value!!);
}

}