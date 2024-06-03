import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { Preferences } from '@capacitor/preferences';
@Injectable({ providedIn: 'root' })

export class DeliveryRegionService extends GenericHttpService<DeliveryRegion> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getAvailability(filter: any) {
        return this.post('deliveryRegion/getAvailability', filter);
      }

      async setLastPostalCode(value: any) {
        await Preferences.set({ key: 'lastPostalCode', value: JSON.stringify(value) });
      }

      async getLastPostalCode() {
        const ret = await Preferences.get({ key: 'lastPostalCode' });
        return JSON.parse(ret.value!!);
      }
      
      async clearLastPostalCode() {
        await Preferences.remove({ key: 'lastPostalCode' });
      }
}
