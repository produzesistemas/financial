import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { DeliveryRegion } from '../_model/delivery-region-model';

@Injectable({ providedIn: 'root' })

export class DeliveryRegionService extends GenericHttpService<any> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('deliveryRegion/filter', filter);
      }



    getById(id: any) {
        return this.http.get<DeliveryRegion>(`${this.getUrlApi()}deliveryRegion/${id}`);
    }

    deleteById(entity: any) {
        return this.post('deliveryRegion/delete', entity);
  }

  active(entity: any) {
    return this.post('deliveryRegion/active', entity);
 }

 save(entity: any) {
    return this.post('deliveryRegion/save', entity);
 }

}
