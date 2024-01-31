import { Injectable } from "@angular/core"
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Store, select } from "@ngrx/store"
import { switchMap, iif, of, Observable } from "rxjs"
import { map, withLatestFrom } from "rxjs/operators"
import { FetchService } from "../services/fetch.service"
import { AppState } from "../store"
import { GetLanguage } from "../store/ui/selectors"

@Injectable({ providedIn: 'root' })
export class OrderResolver implements Resolve<any> {
  constructor(private api: FetchService, private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return of(route.paramMap.get('id') || '').pipe(
      withLatestFrom( this.store.pipe( select(GetLanguage)) ),
      switchMap( ([id, l]) => this.api.getRoomServiceDataArticlesList( id, l ).pipe( map( d => ({data: d})) )
    ))
  }
}