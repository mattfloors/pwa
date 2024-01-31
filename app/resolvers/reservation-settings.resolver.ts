import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, filter, tap, withLatestFrom, take } from "rxjs/operators"
import { FetchService } from "../services/fetch.service"
import { AppState } from "../store"
import { GetLanguage, GetReservationInfos, GetSettingsInfos } from "../store/ui/selectors"
import { GetReservationSuccess, GetSettingsSuccess } from "../store/ui/actions"
import { ISettings } from "../models/reservation.model"
import { AuthService } from "../services/auth.service"

@Injectable({ providedIn: 'root' })
export class ReservationSettingsResolver implements Resolve<any> {
  constructor(private api: FetchService, private auth: AuthService, private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    console.log('ReservationSettingsResolver');
    return of(true).pipe(
      withLatestFrom( this.store.pipe( select(GetLanguage) )),
      withLatestFrom( this.store.pipe(select( GetReservationInfos )) ),
      switchMap( ([[a, language], r]) => 
        iif( () => !(r),
          this.api.getReservation({[this.auth.getAccessKey()]: this.auth.getReservationId()}, language),
          of(r)
        )
      ),
      tap(console.log),
      tap( (r) => r ? this.store.dispatch( GetReservationSuccess({payload: r})) : {} ),
      tap(console.log),
      take(1),
    )
  }
}

// this.store.dispatch( GetReservation( {payload: {[this.auth.getAccessKey()]: this.auth.getReservationId()} } ) );