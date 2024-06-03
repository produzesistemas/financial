import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, EMPTY, from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericHttpService } from './genericHttpService';
import { ApplicationUser } from 'src/app/_model/application-user';
import { LoginUser } from '../_model/login-user-model';
import { Module } from '../_model/module-model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends GenericHttpService<any>{
    protected baseUrl = `${environment.urlApi}`;
    protected baseSite = `${environment.urlApi}`;
    // private currentUserSubject: BehaviorSubject<any>;
    // public currentUser: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        super(http);
        // this.currentUser = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('scheduling_user')));
        // this.currentUser = this.currentUserSubject.asObservable();
    }

    registerMaster(user: LoginUser) {
        return this.postAll('account/registerMaster', user);
    }

    logout() {
        localStorage.removeItem('financial_user');
        // this.currentUser.next(null);
    }

    addCurrenUser(user: any) {
        localStorage.setItem('financial_user', JSON.stringify(user));
    }

    clearUser() {
        localStorage.removeItem('financial_user');
    }

    getCurrentUser() {
        return new BehaviorSubject<any>(JSON.parse(localStorage.getItem('financial_user') || '{}')).getValue();
    }

    save(store: FormData) {
        return this.post('account/save', store);
    }

    loginAdministrator(user: any) {
        return this.postAll('account/loginAdministrator', user);
    }

    loginPartner(user: any) {
        return this.post('account/loginPartner', user);
    }

    getByFilter(filter: any) {
        return this.postAll('account/filter', filter);
      }

      getEmployees() {
        return this.http.get<any[]>(`${this.getUrlApi()}account/getEmployees`);
    }

      register(user: any) {
        return this.postAll('account/register', user);
    }



    registerWeb(entity: any) {
        return this.post('account/registerWeb', entity);
     }  

    recoverPassword(user: any) {
        return this.postAll('account/recoverPassword', user);
    }


    deleteById(id: any) {
        return this.delete(`account/${id}`);
  }

  disableUser(user: any) {
    return this.postAll('account/disable', user);
}

enableUser(user: any) {
    return this.postAll('account/enable', user);
}

getModules() {
    return this.http.get<any>(`${this.getUrlApi()}account/getModules`);
}

changePassword(user: any) {
    return this.postAll('account/changePassword', user);
}

userConfirm(user: any) {
    return this.post('account/userConfirm', user);
}

userConfirmForgot(user: any) {
    return this.post('account/userConfirmForgot', user);
}

registerEstablishment(entity: any) {
    return this.post('account/registerEstablishment', entity);
  }  
  
  getClients() {
    return this.http.get<any>(`${this.getUrlApi()}account/getClients`);
}


}
