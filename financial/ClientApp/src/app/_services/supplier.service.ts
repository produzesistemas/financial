import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Supplier } from 'src/app/_model/supplier-model';

@Injectable({ providedIn: 'root' })

export class SupplierService extends GenericHttpService<Supplier> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('supplier/filter', filter);
      }

      save(entity: any) {
        return this.post('supplier/save', entity);
     }

    deleteById(id: any) {
            return this.delete(`supplier/${id}`);
      }

      getSupplier(id: any) {
        return this.http.get<Supplier>(`${this.getUrlApi()}supplier/${id}`);
    }
}
