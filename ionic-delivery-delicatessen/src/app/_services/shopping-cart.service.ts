import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    
async insert(value: any) {
    await Preferences.set({ key: 'shopping-cart', value: JSON.stringify(value) });
  }
  
  async getAllShoppingCart() {
    const ret = await Preferences.get({ key: 'shopping-cart' });
    return JSON.parse(ret.value!!);
  }
  
  async deleteAll() {
    await Preferences.remove({ key: 'shopping-cart' });
  }



}