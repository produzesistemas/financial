import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Coupon } from '../_models/coupon-model';
@Injectable({ providedIn: 'root' })

export class CouponService extends GenericHttpService<Coupon> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getCoupon(filter: any) {
        return this.post('coupon/getByCodigo', filter);
      }  


}
