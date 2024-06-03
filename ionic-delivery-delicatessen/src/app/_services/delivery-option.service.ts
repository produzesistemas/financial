import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class DeliveryOptionService {
    
async insert(value: any) {
    await Preferences.remove({ key: 'delivery-option' });
    await Preferences.set({ key: 'delivery-option', value: JSON.stringify(value) });
  }
  
  async getDeliveryOption() {
    const ret = await Preferences.get({ key: 'delivery-option' });
    return JSON.parse(ret.value!!);
  }
  
  async deleteAll() {
    await Preferences.remove({ key: 'delivery-option' });
  }



}