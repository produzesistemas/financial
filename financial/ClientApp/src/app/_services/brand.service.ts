import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Brand } from '../_model/brand-model';

@Injectable({ providedIn: 'root' })

export class BrandService extends GenericHttpService<Brand> {
    constructor(private http: HttpClient) {
        super(http);
    }

    getAllBrand() {
        return this.http.get<Brand[]>(`${this.getUrlApi()}establishmentBrand/getAll`);
    }
    
    }
