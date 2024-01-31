export interface IRoom {
  code: string;                           //"ROOMS"
  description: string;                    //"RoomService"
  openingTime: IRoomAvailabilty[];
  resourceCode: string;                   //"CORLAMP"
  activable?: boolean;
  data?: IOrderItemLight[];
}
export interface IRoomAvailabilty {
  iddayOfWeek: number;
  dayOfWeek: string;
  fromHour: string;
  toHour: string;
}

interface IOrderInfo {
  code: string;
  description: string;
  resourceCode: string;
  serviceAmount: number;
  servicePerc: number;
}

export enum ERoomType {
  NULL,
  RESTAURANT,
  SERVICE_ROOM,
}

export class OrderInfo implements IOrderInfo {
  code: string;
  description: string;
  resourceCode: string;
  serviceAmount: number;
  servicePerc: number;
  constructor(options: any) {
    this.code = options.code;
    this.description = options.description;
    this.resourceCode = options.resourceCode;
    this.serviceAmount = options.serviceAmount;
    this.servicePerc = options.servicePerc;
  }
}

export interface IRoomPositions extends IRoom {

  resourceCode: string;
  serviceAmount: number;
  servicePerc: number;
  servicePositions: IRoomPosition[]

}
export interface IRoomPosition{
  code: string;
  description: string;
  orderId: number;
  resourceCode: string;
  tableCode: string;
}
export interface IOrderItemLight {
  Codice: string;       // "COCKT"
  Descrizione: string;  // "COCKTAIL"
  SubTipiPiatto: IOrderItemLight[] | null;
  SubTipoFittizio: boolean;
}
export interface IOrderMenu {
  Articles: IOrderItem[]
  Codice: string;
  Componibile: false
  Descrizione: string;
  Disponibilita: number;
  Prezzo: number;
  Rooms: any[];
  TipoPiatto: string;
  Note?: string;
  Qta?: number;
}

export class OrderMenu {
  public Articles: IOrderItem[];
  public Codice: string;
  public Descrizione: string;
  public Prezzo: number;
  private index?: number;
  constructor(menu: any, index: number) {
    this.Articles = menu.Articles;
    this.Codice = menu.Codice;
    this.Descrizione = menu.Descrizione;
    this.Prezzo = menu.Prezzo;
    this.index = index;
  }

  getItems(): IOrderItemSemplify[] {
    return this.Articles.map( (i: IOrderItem) => ({
      ...{},
      Articolo: i.Codice,
      Quantita: 1,
      Preferenza: i.Note,
      ProgMenu: this.index,
      CodiceMenu: this.Codice
    } as IOrderItemSemplify) );
  }
}

export interface IOrderItem {
  Alternative: boolean;
  Codice: string;
  Descrizione: string;
  FoodBeverage: string;
  Frequente: boolean;
  Giacenza: number;
  Informazioni: boolean;
  Menu: boolean;
  OrdineTipo: number;
  RowNumber: number;
  SubTipo: string;
  Tipo: string;
  Prezzo?: number;
  CategorieSpeciali?: string[];
  Qta?: number;
  Note?: string;
  Articles?: IOrderItem[];
}

// export class OrderItem {
//   Articolo: string;
//   Preferenza?: string;
//   Quantita?: number;
//   ProgMenu?: number;
//   CodiceMenu?: string;
//   constructor(options: any, index = 0) {
//     this.Articolo = options.Articlo;
//     this.Quantita = options.Quantita;
//   }
//   public setNote(note: string) {
//     this.Preferenza = note;
//   }
//   public export() {
//     return 
//   }
// }

export interface IStoredMenu {
  subTipi: {[tipo: string]: [string , IOrderItem[]][] };
  tipi: any[];
}
export interface IStoredMenuList {
  menu: IOrderItem[];
  frequenti: IOrderItem[];
  piatti: IOrderItem[];
  keys: any[]
}

export interface IOrderItemSemplify {
  Articolo: string; // article Code
  Quantita: number;      
  Preferenza: string;
  // IsMenu: boolean; 
  ProgMenu?: number;
  CodiceMenu?: string;
}

export class OrderItemSemplify {
  Articolo: string; // article Code
  Quantita: number;
  Preferenza: string;
  // IsMenu: boolean; 
  ProgMenu?: number;
  CodiceMenu?: string;
  constructor(options: any, menu: boolean) {
    this.Articolo = options.Articolo;
    this.Quantita = 1;
    this.Preferenza = options.Preferenza;
    if(menu) {
      this.addMenu(options);
    }
  }
  addMenu(options: any) {
    this.ProgMenu = options.ProgMenu;
    this.CodiceMenu = options.CodiceMenu;
  }
}

export interface IOrderPayload {
  Sala: string;             // "RISSP", PlaceId
  Tavolo?: string;          // "SP03", TableId
  CodicePresenza: number;   // StayId
  CodiceAnagrafica: number; // GuestId
  ListOfDettagli: IOrderItemSemplify[]
}

export interface IIncrease {
  ImportoMaggiorazione: number;
  InternalStatusCode: string
  Message: string;
  StatusCode: number;
  Success: boolean;
}
export interface ICategory {
  Codice: string;
  Descrizione: string;
}