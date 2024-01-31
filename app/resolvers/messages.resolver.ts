import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, withLatestFrom, tap, catchError } from "rxjs/operators"
import { IMessagePayload, IMessagesPayload } from "../models/messages.model"
import { IRoom, IRoomPositions, OrderInfo } from "../models/order.model"
import { FetchService } from "../services/fetch.service"
import { StoreService } from "../services/store.service"
import { UiService } from "../services/ui.service"
import { AppState } from "../store"
import { SetMessages, SetArea } from "../store/messages/actions"
import { GetAreas } from "../store/messages/selectors"
import { SetOrderInfo } from "../store/orders/actions"
import { GetLanguage, GetReservationInfos, GetReservationState } from "../store/ui/selectors"

@Injectable({ providedIn: 'root' })
export class MessagesResolver implements Resolve<IMessagesPayload[]> {
  constructor(private api: FetchService, private store: Store<AppState>, private uiService: UiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IMessagesPayload[]>|Promise<IMessagesPayload[]>|IMessagesPayload[] {
    return of(route.paramMap.get('id') || '').pipe(
      withLatestFrom( this.store.pipe( select(GetReservationState))),
      withLatestFrom( this.store.pipe( select(GetReservationInfos))),
      withLatestFrom( this.store.pipe( select(GetAreas))),
      switchMap( ([[[id, reservationState],reservation], areas]) => {
        const area = areas.find( (e: any) => e.code === id );
        const payload = reservationState === 'INHOUSE' ? { stayId: reservation?.stayId } : {reservationId: reservation?.reservationId}
        // reservationId: reservation?.guestId,
        return this.api.getMessages({
          ...payload,
          hotelArea: area
        }).pipe(
          tap( (r: IMessagesPayload[]) => {
            if( Array.isArray(r) ) {
              let [data] = r;
              if(!data){
                data = {messages: [], stayId: -1, hotelArea: null}
              }
              this.store.dispatch( SetMessages({payload: data}) )
              this.store.dispatch( SetArea({payload: id }) )
            }
          }),
          map( (r: IMessagesPayload[]) => r ),
          catchError( () => of([{messages: [], stayId: -1, hotelArea: null}]) )
      )})
    )
    
  }
}