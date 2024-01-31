import { Injectable } from "@angular/core";
import { __core_private_testing_placeholder__ } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { catchError, Observable, switchMap, of, take } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { FetchService } from "../services/fetch.service";
import { DialogComponent } from "../shared/dialog/dialog.component";
import { AppState } from "../store";
import { GetLanguage, GetReservationInfos } from "../store/ui/selectors";

@Injectable({
  providedIn: 'root'
})
export class CheckGuard implements CanActivate {
  constructor(public api: FetchService, private store: Store<AppState>, private dialog: MatDialog) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return of(true)
    }
  canLoad(route: Route) {
    // console.log(route);
    return true;
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class AreaRoomCheckGuard implements CanActivate {
//   constructor(public api: FetchService, private store: Store<AppState>, private dialog: MatDialog) {}
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//       return this.store.pipe( select( GetReservationInfos ) ).pipe(
//         switchMap( r => this.api.checkRoomServiceAvailability(r?.roomNumber, r?.stayId, r?.guestId, ).pipe(
//           map( e => true),
//           catchError( (error) => {
//             console.log(error);
//             this.dialog.open(DialogComponent, {data: {title: '', text: error.error} })
//           return of(false)
//           })
//         ) ),
//         take(1)
//       )
       
//     }
// }