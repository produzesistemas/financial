import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { DelicatessenProduct } from '../_models/delicatessen-product-model';
@Injectable({ providedIn: 'root' })

export class DelicatessenProductService extends GenericHttpService<DelicatessenProduct> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByEstablishment(filter: any) {
        return this.postAll('delicatessenProduct/getByEstablishment', filter);
      }

      getAllSearch(filter: any) {
        return this.postAll('delicatessenProduct/getByDescription', filter);
      }
  

}
