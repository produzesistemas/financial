import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DelicatessenOrder } from '../_model/delicatessen-order-model';
import { GenericHttpService } from './genericHttpService';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DelicatessenOrderService extends GenericHttpService<DelicatessenOrder> {

    constructor(private http: HttpClient) {
        super(http);
    }

    save(entity: any) {
        return this.post('delicatessenOrder/save', entity);
     }

     getByFilter(filter: any) {
        return this.postAll('delicatessenOrder/filter', filter);
      }

      getToPartner(filter: any) {
        return this.post('delicatessenOrder/getToPartner', filter);
      }

      getById(id: any) {
        return this.http.get<DelicatessenOrder>(`${this.getUrlApi()}DelicatessenOrder/${id}`);
    }

      getLastPostalCode() {
        return this.http.get<any>(`${this.getUrlApi()}delicatessenOrder/getLastAddress`);
      }

      onConfirm(filter: any) {
        return this.postAll('delicatessenOrder/confirm', filter);
      }

      onConfirmDelivery(filter: any) {
        return this.postAll('delicatessenOrder/confirmDelivery', filter);
      }

      cancel(filter: any) {
        return this.postAll('delicatessenOrder/cancel', filter);
      }

      cancelPartner(filter: any) {
        return this.postAll('delicatessenOrder/cancelPartner', filter);
      }

      SendMail(filter: any) {
        return this.postAll('delicatessenOrder/confirmDeliveryMail', filter);
      }

      getByPartner(filter: any) {
        return this.postAll('delicatessenOrder/getByPartner', filter);
      }

    getAllDelicatessenOrderStatus() {
        return this.http.get<any>(`${this.getUrlApi()}DelicatessenOrderStatus`);
    }

    getDelicatessenOrder(id: number) {
      return this.http.get<any>(`${this.getUrlApi()}delicatessenOrder/${id}`);
    }

}
