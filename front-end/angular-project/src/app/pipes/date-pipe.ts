import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateBr',
  standalone: true
})
export class DateBrPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}`;
  }
}