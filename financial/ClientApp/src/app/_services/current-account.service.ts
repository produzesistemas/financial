import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { CurrentAccount } from 'src/app/_model/current-account-model';

@Injectable({ providedIn: 'root' })

export class CurrentAccountService extends GenericHttpService<CurrentAccount> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('currentAccount/filter', filter);
      }

      save(entity: any) {
        return this.post('currentAccount/save', entity);
     }

    deleteById(id: any) {
            return this.delete(`currentAccount/${id}`);
      }

      getCurrentAccount(id: any) {
        return this.http.get<CurrentAccount>(`${this.getUrlApi()}currentAccount/${id}`);
    }
}
