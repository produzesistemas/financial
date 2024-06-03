import { StatusOrder } from 'src/app/_model/status-order-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';

@Injectable({ providedIn: 'root' })

export class StatusOrderService extends GenericHttpService<StatusOrder> {

    constructor(private http: HttpClient) {
        super(http);
    }
   getAllStatusOrder() {
    return this.http.get<StatusOrder[]>(`${this.getUrlApi()}StatusOrder/getAll`);
}

}
