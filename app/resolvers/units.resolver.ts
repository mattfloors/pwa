import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, withLatestFrom, tap } from "rxjs/operators"
import { IMessagePayload, IMessagesPayload } from "../models/messages.model"
import { IRoom, IRoomPositions, OrderInfo } from "../models/order.model"
import { FetchService } from "../services/fetch.service"
import { StoreService } from "../services/store.service"
import { UiService } from "../services/ui.service"
import { AppState } from "../store"
import { SetMessages, SetArea, GetUnitsSuccess } from "../store/messages/actions"
import { GetAreas } from "../store/messages/selectors"
import { SetOrderInfo } from "../store/orders/actions"
import { GetLanguage, GetReservationInfos, GetReservationState } from "../store/ui/selectors"

@Injectable({ providedIn: 'root' })
export class UnitsResolver implements Resolve<IMessagesPayload[]> {
  constructor(private api: FetchService, private store: Store<AppState>, private uiService: UiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IMessagesPayload[]>|Promise<IMessagesPayload[]>|IMessagesPayload[] {
    return of(route.paramMap.get('id') || '').pipe(
      withLatestFrom( this.store.pipe( select(GetReservationInfos))),
      withLatestFrom( this.store.pipe( select(GetReservationState))),
      withLatestFrom( this.store.pipe( select(GetLanguage))),

      switchMap( ([[[a,b],c], l]) => {
        const payload = c === 'INHOUSE' ? {stayId: b?.stayId} : {reservationId: b?.reservationId};
        return this.api.getUnits(payload, l).pipe(
          tap( (r) => this.store.dispatch( GetUnitsSuccess({payload: r}) ) ),
          map( r => r)
        )
      })
    )
  }
}