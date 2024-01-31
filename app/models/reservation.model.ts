export interface IReservation {
  arrive: string;
  avaibleFunctions: string[];
  departure: string;
  guestName: string;
  guestSurname: string;
  mealPlan: string;
  reservationState: 'INHOUSE' | 'RESERVED';
  roomType: string;
  totalGuestsNumber: 2
  totalStayAmount: string;
  urlWebCheckin?: string;
  urlWebCheckOut?: string;
  roomNumber?: string;
  guestId?: number;
  stayId?: number;
  reservationId?: number;
}

export interface IHotel {
  id: number;
  name: string;
  data?: any[];
}

export interface ILanguageSettings {
  code: string;
  description: string;
  isDefaultLanguage: boolean;
}
export interface ITranslateItem {
  description: string;
  lang: string;
}

export interface ITranslate {
  description: string;
  translations: ITranslateItem[]
}

export interface IFunctionSettings {
  functionName: string;
  position: number;
  descriptions: ITranslate;
}
export interface ISettings {
  activeFunctions: IFunctionSettings[];
  languagesList: ILanguageSettings[];
  logo: string;
  primaryColor: number;
  useQRCode: boolean;
  useRestaurantWishes: boolean;
  currencySimbol: string;
  currencyDecimalSeparator: string;       // ","
  currencyThousandsSeparator: string;     // "."
  welcomeMessages: ITranslate;
}

export interface IPages {
  shortDescription: string;
  page: string;
}

export interface IApplicationState {
  activeFunctions: IFunctionSettings[];
  guestId: number;
  stayId: number;
  roomNumber: string;
  urlWebCheckOut: string;
  urlWebCheckin?: string;
  reservationId?: number;
}