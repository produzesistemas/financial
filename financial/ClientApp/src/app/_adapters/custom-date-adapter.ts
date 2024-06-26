import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'pt-br': {
      weekdays: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  },
};

@Injectable()
export class I18n {
  language = 'pt-br';
}

@Injectable()
export class CustomDateAdapter extends NgbDatepickerI18n {
  override getMonthShortName(month: number, year?: number | undefined): string {
    return I18N_VALUES['pt-br'].months[month - 1];
  }
  override getWeekdayLabel(weekday: number, width?: TranslationWidth | undefined): string {
    return I18N_VALUES['pt-br'].weekdays[weekday - 1];
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    return this.toModel(date);
  }

  constructor(private i18n: I18n) {
    super();
}

getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
}

  // fromModel(value: string): NgbDateStruct
  // {
  //    if (!value) {
  //     return null;
  //    }
  //    const parts = value.split('/');
  //    return {day: + parts[0], month: + parts[1], year: + parts[2]} as NgbDateStruct;
  // }

  toModel(date: NgbDateStruct): string
  {
       return date ? ('0' + date.day).slice(-2) + '/' + ('0' + date.month).slice(-2) + '/' + date.year : '';
  }



}
