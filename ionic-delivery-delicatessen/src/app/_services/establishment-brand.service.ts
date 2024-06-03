import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Preferences } from '@capacitor/preferences';
@Injectable({ providedIn: 'root' })

export class EstablishmentBrandService extends GenericHttpService<any> {
    constructor(private http: HttpClient) {
        super(http);
    }

      getEstablishmentBrandCredit(filter: any) {
        return this.postAll('establishmentBrand/getCreditByEstablishment', filter);
      }
      getEstablishmentBrandDebit(filter: any) {
        return this.postAll('establishmentBrand/getDebitByEstablishment', filter);
      }
}
