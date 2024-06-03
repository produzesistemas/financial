import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { CenterCost } from 'src/app/_model/center-cost-model';

@Injectable({ providedIn: 'root' })

export class CenterCostService extends GenericHttpService<CenterCost> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('centerCost/filter', filter);
      }

      save(entity: any) {
        return this.post('centerCost/save', entity);
     }

    deleteById(id: any) {
            return this.delete(`centerCost/${id}`);
      }

      getCenterCost(id: any) {
        return this.http.get<CenterCost>(`${this.getUrlApi()}centerCost/${id}`);
    }
}
