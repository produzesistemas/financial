import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';

@Injectable({ providedIn: 'root' })

export class PaymentFormService extends GenericHttpService<any> {
    constructor(private http: HttpClient) {
        super(http);
    }

      getAllPaymentForm() {
        return this.http.get<any>(`${this.getUrlApi()}paymentForm`);
    }
}
