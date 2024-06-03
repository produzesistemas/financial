import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { AccountType } from 'src/app/_model/account-type-model';

@Injectable({ providedIn: 'root' })

export class AccountTypeService extends GenericHttpService<any> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getAllType() {
        return this.http.get<any>(`${this.getUrlApi()}accountType`);
      }


}
