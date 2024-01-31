import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, iif, Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { IMessagePayload, IMessages, IMessagesPayload, IMessagesResponse, ISubscriptionPayload, IUnitsPayload, MessagesPayload, SubscriptionToken } from '../models/messages.model';
import { ICategory, IIncrease, IOrderItem, IOrderItemLight, IOrderMenu, IOrderPayload, IRoom, IRoomPositions } from '../models/order.model';
import { IReservation, IHotel, ISettings, IPages } from '../models/reservation.model';
import { IService, IServiceContent } from '../models/service.model';
import { ISurvey, ISurveyPayload, ISurveyResult } from '../models/survey.model';
import { getSearchStringFromObject } from '../shared/utilites/utilities';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  //#region Token
  public getParsedToken(hasReservation?: string): Observable<number> {
    return iif( () => Boolean(hasReservation), 
      of(1),
      of(-1)
    )
  }

  public getVersion(): Observable<number> {
    return this.http.get<number>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetVersion`)
  }

  public getReservation(payload: any, lang: string): Observable<IReservation> {
    return this.http.get<IReservation>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetReservationData${getSearchStringFromObject(payload)}&lang=${lang}`)
  }

  public getReservationAfterLogin(payload: string | number, lang?: string): Observable<IReservation> {
    return this.http.get<IReservation>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetReservationData?reservationId=${payload}`)
  }

  public getAccess(hotelId: string, reservationId?: string, key?: string): Observable<string> {
    return this.http.get<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Access?hotel=${hotelId}&${key}=${reservationId || ''}`).pipe( map(({access_token}) => access_token ))
    
  }

  public login(hotelId: string, reservationId?: string | number, surname?: string): Observable<string> {
    return this.http.get<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Access?hotel=${hotelId}&reservationId=${reservationId}&surname=${surname}`).pipe( map(({access_token}) => access_token ))
  }
  //#endregion
  //#region Configurations

  public getConfiguration(): Observable<ISettings> {
    return this.http.get<ISettings>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetConciergeSettings`)
  }
  //#endregion
  //#region Messaging

  public registerSubscription(payload: ISubscriptionPayload): Observable<boolean> {
    return this.http.post<boolean>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}concierge/notification/subscribe`, JSON.stringify(payload) )
  }

  public unSubscribeRegistration(payload: ISubscriptionPayload): Observable<boolean> {
    return this.http.post<boolean>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}concierge/notification/unsubscribe`, JSON.stringify(payload) )
  }

  public getUnits(payload: IUnitsPayload, lang: string): Observable<any> {
    return this.http.post<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetHotelUnits?lang=${lang}`, JSON.stringify(payload) )
  }

  public getMessages(payload: any): Observable<IMessagesPayload[]> {
    // return this.http.post<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetMessages?reservationId=${reservationId || ''}&stayId=${stayId}&unitCode=${unitCode || -1}`)
    return this.http.post<IMessagesPayload[]>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetMessages`, JSON.stringify(payload))
  }

  public openedMessage(payload: MessagesPayload): Observable<IMessagesPayload> {
    return this.http.post<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/SetMessageState`, JSON.stringify(payload))
  }

  public addMessage(payload: IMessagesPayload): Observable<IMessagesPayload> {
    return this.http.post<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/InsertMessage`, JSON.stringify(payload))
  }

  //#endregion
  //#region Survey
  public getSurvey(stayId: number, lang: string): Observable<ISurvey[] | string> {
    return this.http.get<ISurvey[] | string>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetSurveyData?stayId=${stayId}&lang=${lang}`)
  }

  public setSurvey(payload: ISurveyPayload): Observable<boolean | string> {
    return this.http.post<boolean | string>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/SaveSurveyData`, JSON.stringify(payload) );
  }
  //#endregion
  //#region Meteo
  public getMeteo(lang: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetMeteoData?lang=${lang}`)
  }
  //#endregion
  //#region Services
  public getService(num: number = 1, lang: string): Observable<IServiceContent> {
    return this.http.get<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetHotelServicesPages?pag=${num}&lang=${lang}`)
  }

  public getServices(lang: string): Observable<IService[]> {
    return this.http.get<IService[]>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/GetHotelServicesPages?lang=${lang}`)
  }
  //#endregion

  //#region Orders
  public getRoom(stayid: number, lang: string) {
    return this.http.get<any>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/ServicesGetAreaPositions?stayid=${stayid}&lang=${lang}`)
  }

  public getRoomServiceData(lang: string):Observable<IRoom> {
    return this.http.get<IRoom>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/RoomServiceGetArea?lang=${lang}`)
  }

  public checkRoomServiceAvailability(lang: string, roomNumber?: string, stayId?: number, guestId?: number): Observable<any> {
    return this.http.get<IRoom>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/ServicesCheckRoomServiceAvaiability??lang=${lang}&roomNumber=${roomNumber}&stayId=${stayId}&guestId=${guestId}`)
  }

  public getAreas(stayid: number, lang: string): Observable<IRoom[]> {
    return this.http.get<IRoom[]>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/ServicesGetOpenAreas?stayid=${stayid}&lang=${lang}`)
  }

  public getAreaPositions(areaCode: string, stayid: number, lang?: string):Observable<IRoomPositions> {
    return this.http.get<IRoomPositions>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/ServicesGetAreaPositions?stayid=${stayid}&areaCode=${areaCode}&lang=${lang}`)
  }

  public checkAreaAvailability(stayId: number, areaCode: string, lang: string = ''): Observable<any> {
    return this.http.get<IRoom>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}Concierge/ServicesCheckPositionAvaiability?positionCode=${areaCode}&stayId=${stayId}&lang=${lang}`);
  }

  public getRoomServiceDataArticles(codice: string, lang: string): Observable<any> {
    return this.http.get<IRoom>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/room/${codice}?lang=${lang}`)
  }

  // menu 
  public getRoomServiceDataArticlesFrequentList(codice: string, lang: string): Observable<IOrderItem[]> {
    return this.http.get<IOrderItem[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/consigliati/room/${codice}?lang=${lang}`)
  }

  public getRoomServiceDataArticlesMenuList(codice: string, lang: string): Observable<IOrderMenu[]> {
    return this.http.get<IOrderMenu[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}menu/room/${codice}?lang=${lang}`)
  }

  public getSearchOrderItems(codice: string, query: string, lang: string): Observable<IOrderItem[]> {
    return this.http.get<IOrderItem[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/search/room/${codice}/${query}?lang=${lang}`)
  }

  public getCategories(lang: string): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/categoriespeciali?lang=${lang}`);
  }

  public getRoomServiceDataArticlesList(codice: string, lang: string): Observable<IOrderItemLight[]> {
    return this.http.get<IOrderItemLight[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/types/room/${codice}?lang=${lang}`)
  }

  public getRoomServiceDataArticlesArticle(lang: string, room: string, codice: string, query?: string): Observable<IOrderItem[]> {
    if(query) {
      return this.http.get<IOrderItem[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/search/types/${codice}/room/${room}?lang=${lang}&subTipo=${query}`)
    }else{
      return this.http.get<IOrderItem[]>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/search/types/${codice}/room/${room}?lang=${lang}`)
    }
  }

  public getOrderItemDetails(codice: string | number, room: string | number, lang: string) {
    return this.http.get<any>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Articles/${codice}/details/room/${room}?lang=${lang}`)
  }
  //#endregion

  //#region Save Comanda
  public saveOrder(payload: IOrderPayload): Observable<boolean> {
    return this.http.post<boolean>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Comande/saveComandaSemplificata`, JSON.stringify(payload) );
  }

  public calculateIncrease(payload: IOrderPayload): Observable<IIncrease> {
    return this.http.post<IIncrease>(`${this.configService.config?.ApiResources[1].ResourceEndpoint}Comande/calcolaMaggiorazione`, JSON.stringify(payload) );
  }

  public subscribeToken(payload: SubscriptionToken): Observable<boolean> {
    return this.http.post<boolean>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}concierge/notification/subscribe`, JSON.stringify(payload))
  }

  public unSubscribeToken(payload: SubscriptionToken): Observable<boolean> {
    return this.http.post<boolean>(`${this.configService.config?.ApiResources[0].ResourceEndpoint}concierge/notification/unsubscribe`, JSON.stringify(payload))
  }
  //#endregion
  constructor(private http: HttpClient, private configService: ConfigService) { }
}
