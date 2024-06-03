import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SubscriptionService extends GenericHttpService<Subscription> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
      return this.postAll('Subscription/filter', filter);
    }

    saveByAdm(entity: any) {
      return this.post('Subscription/saveByAdm', entity);
   }

   getAllSubscription() {
    return this.http.get<Subscription[]>(`${this.getUrlApi()}Subscription/getAll`);
}

  deleteById(entity: any) {
          return this.post('Subscription/delete', entity);
    }

    getById(id: any) {
      return this.http.get<Subscription>(`${this.getUrlApi()}Subscription/${id}`);
  }

}
