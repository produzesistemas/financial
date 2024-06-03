import { DelicatessenCoupon } from '../_model/delicatessen-coupon-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DelicatessenCouponService extends GenericHttpService<DelicatessenCoupon> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('coupon/filter', filter);
      }

      getByCode(filter: any) {
        return this.post('coupon/getByCode', filter);
      }

    getById(id: any) {
        return this.http.get<DelicatessenCoupon>(`${this.getUrlApi()}coupon/${id}`);
    }

    deleteById(id: any) {
        return this.delete(`coupon/${id}`);
  }

  active(entity: any) {
    return this.post('coupon/active', entity);
 }

 save(entity: any) {
    return this.post('coupon/save', entity);
 }

 getActive() {
  return this.http.get<any>(`${this.getUrlApi()}coupon/getActive`);
}

}
