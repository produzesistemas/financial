import { Injectable } from '@angular/core';
import { OpeningHours } from '../_models/opening-hours-model';

@Injectable({ providedIn: 'root' })
export class UtilsService {

    constructor() {
        
    }



    getOpeningHourActual(openingHours: OpeningHours[]) : OpeningHours | undefined {
        const dateCurrent = new Date();
        let find = openingHours.find(x => x.weekday === dateCurrent.getDay());
        if (find) {
                    let openingHoursStart = new Date();
                    openingHoursStart.setHours(Number(find.startTime!.substring(0,2)));
                    openingHoursStart.setMinutes(Number(find.startTime!.substring(2,4)));
                    let openingHoursEnd = new Date();
                    openingHoursEnd.setHours(Number(find.endTime!.substring(0,2)));
                    openingHoursEnd.setMinutes(Number(find.endTime!.substring(2,4)));
                    if ((openingHoursStart < dateCurrent) && (openingHoursEnd > dateCurrent)) {
                        return find;
                    }
        }
        return undefined;
      }



}