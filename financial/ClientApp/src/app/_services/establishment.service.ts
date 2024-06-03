import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Establishment } from '../_model/establishment-model';

@Injectable({ providedIn: 'root' })

export class EstablishmentService extends GenericHttpService<Establishment> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
      return this.postAll('Establishment/filter', filter);
    }

    update(entity: any) {
      return this.post('Establishment/update', entity);
   }

   registerPartnerByAdm(user: any) {
    return this.postAll('account/registerPartnerByAdm', user);
}

   getAllEstablishment() {
    return this.http.get<Establishment[]>(`${this.getUrlApi()}establishment/getAll`);
}

getByOwner() {
  return this.http.get<Establishment>(`${this.getUrlApi()}establishment/getByOwner`);
}

  deleteById(entity: any) {
          return this.post('Establishment/delete', entity);
    }

    getById(id: any) {
      return this.http.get<Establishment>(`${this.getUrlApi()}Establishment/${id}`);
  }

  active(entity: any) {
    return this.post('Establishment/active', entity);
 }

 sendMessage(entity: any) {
  return this.post('establishment/sendMessage', entity);
}

deleteImage(entity: Establishment) {
  return this.post('establishment/deleteImage', entity);
}

}
