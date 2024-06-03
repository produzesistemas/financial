import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypeService {
private types: any[] = [];
    constructor() {
        this.loadTypes();
    }

    loadTypes() {
        this.types.push({id: 2, name: 'Contas a pagar'});
        this.types.push({id: 4, name: 'Registro de vendas'});
        this.types.push({id: 5, name: 'Agendamento de serviços'});
        this.types.push({id: 6, name: 'Orçamento de serviços'});
      }

      getNameTypes(id : number) : string {
        return this.types.find(x => x.id === id).name;
      }

      get() {
          return this.types;
      }

}
