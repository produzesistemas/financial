import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { DelicatessenOrder } from '../_models/delicatessen-order-model';
@Injectable({ providedIn: 'root' })

export class DelicatessenOrderService extends GenericHttpService<DelicatessenOrder> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByUser(filter: any) {
        return this.postAll('DelicatessenOrder/getByUser', filter);
      }  

      getById(id: any) {
        return this.http.get<DelicatessenOrder>(`${this.getUrlApi()}DelicatessenOrder/${id}`);
    }

}
