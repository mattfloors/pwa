import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, filter, tap, withLatestFrom, take } from "rxjs/operators"
import { FetchService } from "../services/fetch.service"
import { AppState } from "../store"
import { GetLanguage, GetSettingsInfos } from "../store/ui/selectors"
import { GetSettingsSuccess } from "../store/ui/actions"
import { ISettings } from "../models/reservation.model"

@Injectable({ providedIn: 'root' })
export class MainPageResolver implements Resolve<any> {
  constructor(private api: FetchService, private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    
    return of(true).pipe(
      withLatestFrom( this.store.pipe( select(GetSettingsInfos) ) ),
      switchMap( ([n, settings]) => iif( () => !!(settings), of(settings), this.api.getConfiguration() ) ),

      tap( (r: ISettings | null) => r ? this.store.dispatch( GetSettingsSuccess({payload: r})) : {} ),
      map( e => e?.activeFunctions && e?.activeFunctions[0] ),

      take(1),
    )
  }
}