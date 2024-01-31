import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable, of, withLatestFrom, iif } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { IRoom } from "../models/order.model";
import { IPages } from "../models/reservation.model";
import { FetchService } from "../services/fetch.service";
import { UiService } from "../services/ui.service";
import { AppState } from "../store";
import { GetServicesSuccess } from "../store/ui/actions";
import { GetLanguage, GetServices } from "../store/ui/selectors";




@Injectable({ providedIn: 'root' })
export class ServicesResolver implements Resolve<IPages> {
  constructor(private api: FetchService, private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of('').pipe(
      withLatestFrom( this.store.pipe(select(GetLanguage))),
      withLatestFrom( this.store.pipe(select(GetServices))),
      switchMap( ([[a, lang], services]) => 
        iif( () => !!(services.length),
          of(services),
          this.api.getServices(lang) )
        ),
      tap( (r) => this.store.dispatch( GetServicesSuccess({payload: r}) ) )
    )
  }
}