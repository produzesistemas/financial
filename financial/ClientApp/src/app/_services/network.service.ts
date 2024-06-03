import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
@Injectable({ providedIn: 'root' })

export class NetworkService extends GenericHttpService<any> {
  private errors: any[] = [];
    constructor(private http: HttpClient) {
        super(http);
    }

    getPayment(entity: any) {
      return this.post('delicatessenOrder/getPayment', entity);
   }

}