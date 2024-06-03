import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { AccountPlan } from 'src/app/_model/account-plan-model';
import { AccountType } from 'src/app/_model/account-type-model';

@Injectable({ providedIn: 'root' })

export class AccountPlanService extends GenericHttpService<AccountPlan> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('accountPlan/filter', filter);
      }

      getAccountType() {
        return this.http.get<any>(`${this.getUrlApi()}accountType`);
      }

      save(entity: any) {
        return this.post('accountPlan/save', entity);
     }

    deleteById(id: any) {
            return this.delete(`accountPlan/${id}`);
      }

      getById(id: any) {
        return this.http.get<AccountPlan>(`${this.getUrlApi()}accountPlan/${id}`);
    }

    importDomain(formData: FormData) {
      return this.postAll('accountPlan/importDomain', formData);
    }
}
