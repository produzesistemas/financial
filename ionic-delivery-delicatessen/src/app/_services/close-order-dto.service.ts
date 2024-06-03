import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { CloseOrderDTO } from '../_models/close-order-dto-model';
@Injectable({ providedIn: 'root' })

export class CloseOrderDtoService extends GenericHttpService<CloseOrderDTO> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getCloseOrderDTO(filter: any) {
        return this.post('CloseOrderDto/getCloseOrderDTO', filter);
      }  


}
