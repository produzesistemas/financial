import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './genericHttpService';
import { Plan } from '../_model/plan-model';

@Injectable({ providedIn: 'root' })

export class PlanService extends GenericHttpService<Plan> {

    constructor(private http: HttpClient) {
        super(http);
    }

    getPLanByModule(filter: any) {
      return this.postAll('subscription/getPLanByModule', filter);
    }

 

}
