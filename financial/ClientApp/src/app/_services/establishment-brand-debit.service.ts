import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { EstablishmentBrandDebit } from '../_model/establishment-brand-debit-model';

@Injectable({ providedIn: 'root' })

export class EstablishmentBrandDebitService extends GenericHttpService<EstablishmentBrandDebit> {
    constructor(private http: HttpClient) {
        super(http);
    }

    saveDebit(entity: any) {
        return this.post('establishmentBrand/saveDebit', entity);
     }

     getDebit() {
        return this.http.get<EstablishmentBrandDebit[]>(`${this.getUrlApi()}establishmentBrand/getDebit`);
    }
    
    }
