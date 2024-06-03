import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericHttpService } from './genericHttpService';
import { Preferences } from '@capacitor/preferences';
import { LoginUser } from '../_models/login-user-model';

@Injectable({ providedIn: 'root' })
export class AuthService extends GenericHttpService<any>{
    protected baseUrl = `${environment.urlApi}`;
    protected baseSite = `${environment.urlApi}`;

    constructor(private http: HttpClient) {
        super(http);
    }

    
async setCurrentUser(value: any) {
    await Preferences.set({ key: 'delivery_user', value: JSON.stringify(value) });
  }
  
  async getCurrentUser() {
    const ret = await Preferences.get({ key: 'delivery_user' });
    return JSON.parse(ret.value!!);
  }
  
  async clearCurrentUser() {
    await Preferences.remove({ key: 'delivery_user' });
  }

  registerClientByEmail(loginUser: LoginUser) {
    return this.post('account/registerClientByEmail', loginUser);
}

loginByCode(loginUser: LoginUser) {
  return this.post('account/loginByCode', loginUser);
}

updateAccount(loginUser: LoginUser) {
  return this.post('account/update', loginUser);
}

}