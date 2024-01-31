import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, tap, withLatestFrom } from "rxjs/operators"
import { IRoom, OrderInfo } from "../models/order.model"
import { FetchService } from "../services/fetch.service"
import { UiService } from "../services/ui.service"
import { AppState } from "../store"
import { SetOrderInfo, SetPositionInfo } from "../store/orders/actions"
import { GetLanguage } from "../store/ui/selectors"

@Injectable({ providedIn: 'root' })
export class RoomServiceResolver implements Resolve<IRoom> {
  constructor(private api: FetchService, private uiService: UiService, private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IRoom>|Promise<IRoom>|IRoom {
    
    return of('').pipe(
      withLatestFrom( this.store.pipe( select(GetLanguage)) ),
      switchMap( ([r, l]) => 
        this.api.getRoomServiceData(l).pipe(
        map( (r: IRoom) => {
          const exist = r.openingTime.find( (a, i) => {
            const parseStart = Number(a.fromHour.split(':').join(''));
            const parseEnd = Number(a.toHour.split(':').join(''));
            return this.uiService.isOpen(a.iddayOfWeek, [parseStart, parseEnd]) }
          );
          this.store.dispatch( SetPositionInfo( {payload: r} ) );
          return ({...r, activable: !!exist});
        }),
        tap( r => this.store.dispatch( SetOrderInfo({payload: new OrderInfo(r)}) )),
        switchMap( (r) => {
          console.log('room_serolver', r);
          // this.store.dispatch( SetPositionInfo( {payload: r} ) );
          return iif( () => r.activable, 
            this.api.getRoomServiceDataArticlesList(r.resourceCode, l).pipe(
              map( (d) => ({...r, data: d}) )
            ),
            of({...r, data: []}) )
        })
      )
    ))
  }
}