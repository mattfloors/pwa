import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { iif, Observable, of, tap } from "rxjs";
import { withLatestFrom, switchMap } from "rxjs/operators";
import { IServiceContent } from "../models/service.model";
import { FetchService } from "../services/fetch.service";
import { AppState } from "../store";
import { GetServiceSuccess } from "../store/ui/actions";
import { GetLanguage, GetService, GetServiceById } from "../store/ui/selectors";




@Injectable({ providedIn: 'root' })
export class ServiceResolver implements Resolve<IServiceContent> {
  constructor(private api: FetchService, private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of(route.params["id"] || 1).pipe(
      withLatestFrom( this.store.pipe( select(GetLanguage)) ),
      withLatestFrom( this.store.pipe( select( GetServiceById( {id: route.params["id"] || 1} ) ))),
      switchMap( ([[id, lang], service]) => 
        iif( () => !!(service),
        of(service),
        this.api.getService(id, lang) )
      ),
      tap( (r) => this.store.dispatch( GetServiceSuccess({payload: r}) ) )
    )
  }
}