import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DaysWeekService {
private daysWeek: any[] = [];
    constructor() {
        this.loadDaysWeek();
    }

    loadDaysWeek() {
        this.daysWeek.push({day: 0, name: 'Domingo'});
        this.daysWeek.push({day: 1, name: 'Segunda-feira'});
        this.daysWeek.push({day: 2, name: 'Terça-feira'});
        this.daysWeek.push({day: 3, name: 'Quarta-feira'});
        this.daysWeek.push({day: 4, name: 'Quinta-feira'});
        this.daysWeek.push({day: 5, name: 'Sexta-feira'});
        this.daysWeek.push({day: 6, name: 'Sábado'});
      }

      getNameDayWeek(day: any) : string {
        return this.daysWeek.find(x => x.day === day).name;
      }

      get() {
          return this.daysWeek;
      }

}
