import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { EstablishmentBrandCredit } from '../_model/establishment-brand-credit-model';

@Injectable({ providedIn: 'root' })

export class EstablishmentBrandCreditService extends GenericHttpService<EstablishmentBrandCredit> {
    constructor(private http: HttpClient) {
        super(http);
    }

    saveCredit(entity: any) {
        return this.post('establishmentBrand/saveCredit', entity);
     }

     getCredit() {
        return this.http.get<EstablishmentBrandCredit[]>(`${this.getUrlApi()}establishmentBrand/getCredit`);
    }
    
    }
