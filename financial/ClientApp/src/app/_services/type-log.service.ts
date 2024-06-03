import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypeLogService {
private types: any[] = [];
    constructor() {
        this.load();
    }

    load() {
        this.types.push({type: 1, name: 'Erro'});
        this.types.push({type: 2, name: 'Download'});
      }

      getName(type: any) {
        return this.types.find(x => x.type === type).name;
      }

      get() {
          return this.types;
      }

}
