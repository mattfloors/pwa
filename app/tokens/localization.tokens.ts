import { InjectionToken } from "@angular/core";

export class Currency {
  private _value: string = '';
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
  }
}

export const CURRENCY = new InjectionToken<Currency>('Currency');