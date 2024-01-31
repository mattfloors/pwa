import { Inject, Pipe, PipeTransform } from "@angular/core";
import { Currency, CURRENCY } from "../tokens/localization.tokens";

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  // constructor(@Inject(CURRENCY) private currencyKey: Currency) {}
  transform(
    value: number | string
  ) {
    const currencyKey = JSON.parse( sessionStorage.getItem('ui-settings') || '' );
    if (typeof value === 'number' || typeof value === 'string') {
      const parsed = parseFloat(value.toString()).toFixed(2);
      return `${currencyKey?.currencySimbol} ${parsed}`;
    } else {
      return value;
    }
  }

}
