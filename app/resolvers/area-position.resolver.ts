import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, withLatestFrom, tap } from "rxjs/operators"
import { IRoom, IRoomPositions, OrderInfo } from "../models/order.model"
import { FetchService } from "../services/fetch.service"
import { UiService } from "../services/ui.service"
import { AppState } from "../store"
import { SetOrderInfo } from "../store/orders/actions"
import { GetLanguage, GetReservationInfos } from "../store/ui/selectors"

@Injectable({ providedIn: 'root' })
export class AreaPositionResolver implements Resolve<IRoom> {
  constructor(private api: FetchService, private store: Store<AppState>, private uiService: UiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IRoomPositions>|Promise<IRoomPositions>|IRoomPositions {
    return of(route.paramMap.get('position') || '').pipe(
      withLatestFrom(this.store.pipe( select(GetLanguage))),
      withLatestFrom(this.store.pipe( select(GetReservationInfos))),
      switchMap( ([[id, lang], reservation]) => this.api.getAreaPositions( route.paramMap.get('position') || '' ,reservation?.stayId || -1, lang ).pipe(
        tap( console.log ),
        tap( (r: IRoomPositions) => this.store.dispatch( SetOrderInfo({payload: new OrderInfo(r)}) ) ),
        map( (r: IRoomPositions) => r )
      ))
    )

  }
}
