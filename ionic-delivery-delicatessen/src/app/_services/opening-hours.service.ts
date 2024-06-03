import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { OpeningHours } from '../_models/opening-hours-model';
@Injectable({ providedIn: 'root' })

export class OpeningHoursService extends GenericHttpService<OpeningHours> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getByEstablishment(filter: any) {
        return this.postAll('OpeningHours/getByEstablishment', filter);
      }
  

}
