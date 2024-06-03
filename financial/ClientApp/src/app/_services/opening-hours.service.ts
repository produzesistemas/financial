import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { OpeningHours } from '../_model/opening-hours-model';

@Injectable({ providedIn: 'root' })

export class OpeningHoursService extends GenericHttpService<OpeningHours> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
      return this.postAll('openingHours/filter', filter);
    }

    getAllOpeningHours() {
      return this.http.get<OpeningHours[]>(`${this.getUrlApi()}openingHours/getAll`);
    }

    save(entity: any) {
      return this.post('openingHours/save', entity);
   }

    getById(id: any) {
      return this.http.get<OpeningHours>(`${this.getUrlApi()}openingHours/${id}`);
  }

  active(entity: any) {
    return this.post('openingHours/active', entity);
 }

 deleteById(entity: any) {
  return this.post('openingHours/delete', entity);
}


}
