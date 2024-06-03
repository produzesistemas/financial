import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Log } from '../_model/log-model';

@Injectable({ providedIn: 'root' })

export class LogService extends GenericHttpService<Log> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getByFilter(filter: any) {
      return this.postAll('Log/filter', filter);
    }  

}
