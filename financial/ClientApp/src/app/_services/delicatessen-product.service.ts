import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DelicatessenProduct } from '../_model/delicatessen-product-model';
import { GenericHttpService } from './genericHttpService';

@Injectable({ providedIn: 'root' })

export class DelicatessenProductService extends GenericHttpService<DelicatessenProduct> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
      return this.postAll('delicatessenProduct/filter', filter);
    }

filterByCategory(filter: any) {
  return this.postAll('delicatessenProduct/getByCategoria', filter);
}

    save(entity: any) {
      return this.post('delicatessenProduct/save', entity);
   }

  deleteById(entity: any) {
          return this.post('delicatessenProduct/delete', entity);
    }

    getById(id: any) {
      return this.http.get<DelicatessenProduct>(`${this.getUrlApi()}delicatessenProduct/${id}`);
  }

  active(entity: any) {
    return this.post('delicatessenProduct/active', entity);
 }

}
