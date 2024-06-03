import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipeService implements PipeTransform {

  transform(telephone: string) {
    let formattedPhone = '';
    if (telephone) {
      const value = telephone.toString().replace(/\D/g, '');
      if (value.length > 12) {
        formattedPhone = value.replace(/(\d{2})?(\d{2})?(\d{5})?(\d{4})/, '+$1 ($2) $3-$4');

      } else if (value.length > 11) {
        formattedPhone = value.replace(/(\d{2})?(\d{2})?(\d{4})?(\d{4})/, '+$1 ($2) $3-$4');

      } else if (value.length > 10) {
        formattedPhone = value.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');

      } else if (value.length > 9) {
        formattedPhone = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');

      } else if (value.length > 5) {
        formattedPhone = value.replace(/^(\d{2})?(\d{4})?(\d{0,4})/, '($1) $2-$3');

      } else if (value.length > 1) {
        formattedPhone = value.replace(/^(\d{2})?(\d{0,5})/, '($1) $2');
      } else {
        if (telephone !== '') { formattedPhone = value.replace(/^(\d*)/, '($1'); }
      }
    }
    return formattedPhone;
  }
}