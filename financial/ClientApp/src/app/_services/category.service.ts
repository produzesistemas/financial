import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Category } from '../_model/category-model';

@Injectable({ providedIn: 'root' })

export class CategoryService extends GenericHttpService<any> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
        return this.postAll('Category/filter', filter);
      }

      getActive(filter: any) {
        return this.postAll('Category/getActive', filter);
      }



    getById(id: any) {
        return this.http.get<Category>(`${this.getUrlApi()}Category/${id}`);
    }

    deleteById(entity: any) {
        return this.post('Category/delete', entity);
  }

  active(entity: any) {
    return this.post('Category/active', entity);
 }

 save(entity: any) {
    return this.post('Category/save', entity);
 }

}
