export interface IMessages {
  // messageText: string,
  // messageDateTime: string,
  // newMessage?: boolean,
  // id?: number,
  // responseToId?: number,
  // from?: string
  MessageDateTime: string;
  MessageText: string;
  From?: string;
  NewMessage?: boolean
  ResponseToId?: 0
  id?: 13
}

export interface ISenderList {
  sender: string[];
}

export interface IUnit {

}

export interface IUnitsPayload {
  stayId?: number;
  reservationId?: number;
}

export interface ISubscriptionPayload {
  stayId?: number;
  reservationId?: number;
  SubscriptionToken: string;
}

export interface IHotelAreaPayload {
  code: string;
  description: string;
  NewMessages: number;
}

export interface IMessagesPayload {
  // reservationId: number;
  hotelArea: IHotelAreaPayload | null;
  messages: IMessagePayload[];
  stayId?: number;
}

export interface IMessagePayload {
  messageText?: string;
  messageDateTime?: string;
  newMessage?: boolean;
  id?: number;
  responseToId?: number;
  from?: string;
}

export interface IMessagesResponse {
  hotelArea: IHotelAreaPayload | null;
  messages: IMessagePayload[];
}

export class MessagesPayload implements IMessagesPayload {
  reservationId?: number;
  stayId?: number;
  hotelArea: IHotelAreaPayload | null;
  messages: IMessagePayload[];
  constructor(stayOrReservation: any, hotelArea: IHotelAreaPayload | null, messages: IMessagePayload[]) {
    if(stayOrReservation.hasOwnProperty('stayId')) {
      this.stayId = stayOrReservation.stayId;
    }
    if(stayOrReservation.hasOwnProperty('reservationId')) {
      this.reservationId = stayOrReservation.reservationId;
    }
    this.hotelArea = hotelArea || null;
    this.messages = messages || [];
  }
}

export class ReadMessagesPayload implements IMessagesPayload {
  reservationId?: number;
  stayId?: number;
  hotelArea: IHotelAreaPayload | null;
  messages: any[];
  constructor(stayOrReservation: any, hotelArea: IHotelAreaPayload | null, messages: IMessagePayload[]) {
    if(stayOrReservation.hasOwnProperty('stayId')) {
      this.stayId = stayOrReservation.stayId;
    }
    if(stayOrReservation.hasOwnProperty('reservationId')) {
      this.reservationId = stayOrReservation.reservationId;
    }
    this.hotelArea = hotelArea || null;
    this.messages = messages.map( m => ({...{}, id: m.id})) || [];
  }
}

export class MessagePayload implements IMessagePayload {
  messageText: string;
  messageDateTime: string;
  newMessage: boolean;
  id: number;
  responseToId: number;
  from: string;
  constructor(options: any) {
    this.messageText = options.messageText;
    this.messageDateTime = options.messageDateTime;
    this.newMessage = options.newMessage;
    this.id = options.id;
    this.responseToId = options.responseToId;
    this.from = options.from;
  }
}

export interface SubscriptionToken {
  SubscriptionToken: string;
  stayId?: number,
  reservationId?: number,
}
