import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'priceToNumber', standalone: true })
export class PriceToNumberPipe implements PipeTransform {
  transform(price: string): number {
    if (price.length < 2) { return NaN; }
    return +price.substring(0, price.length - 1);
  }

}
