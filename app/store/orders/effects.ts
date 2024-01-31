import { Injectable } from "@angular/core";
import * as orderActions from "./actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, of, iif } from "rxjs";
import { catchError, map, tap, switchMap, withLatestFrom } from "rxjs/operators";
import { FetchService } from "../../services/fetch.service";
import { AppState } from "..";
import { Store, select } from "@ngrx/store";
import { GetLanguage, GetReservationInfos } from "../ui/selectors";
import { GetOrderInfo, GetOrderInfos, GetPositionCode, GetTableCode } from "./selectors";
import { ERoomType, ICategory, IIncrease, IOrderItemLight, IOrderItemSemplify, IRoomPositions } from "../../models/order.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class OrderEffects {

  getSettings$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.SetOrderInfo),
    map( () => EMPTY)
  ), {dispatch: false} )

  getMenus$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetMenuItems),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], language]) => this.api.getRoomServiceDataArticlesMenuList(positionCode, language).pipe(
      map( res => orderActions.GetMenuItemsSuccess({payload: res}) ),
      catchError( () => of(orderActions.GetMenuItemsFail()) )
    ))
  ))

  getFavorites$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetFavoritesItems),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], language]) => this.api.getRoomServiceDataArticlesFrequentList(positionCode, language).pipe(
      map( res => orderActions.GetFavoritesItemsSuccess({payload: res}) ),
      catchError( () => of(orderActions.GetFavoritesItemsFail()) )
    ))
  ))

  checkMenus$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.CheckMenuItems),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], language]) => this.api.getRoomServiceDataArticlesMenuList(positionCode, language).pipe(
      map( res => orderActions.CheckMenuItemsSuccess({payload: res}) ),
      catchError( () => of(orderActions.CheckMenuItemsFail({payload: []})) )
    ))
  ))

  checkFavorites$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.CheckFavoritesItems),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], language]) => this.api.getRoomServiceDataArticlesFrequentList(positionCode, language).pipe(
      map( res => orderActions.CheckFavoritesItemsSuccess({payload: res}) ),
      catchError( () => of(orderActions.CheckFavoritesItemsFail({payload: []})) )
    ))
  ))

  previewOrder$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.PreviewOrder),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetTableCode) )),
    switchMap( ([[[action, reservationInfos], positionCode], tableCode]) => this.api.calculateIncrease({...{},
      Sala: positionCode,
      Tavolo: tableCode,
      CodicePresenza: reservationInfos && reservationInfos.stayId || -1,
      CodiceAnagrafica: reservationInfos && reservationInfos.guestId || -1,
      ListOfDettagli: action.payload // groupArticles()
      }).pipe(
      map( (result: IIncrease) => orderActions.PreviewOrderSuccess({payload: action.payload, increase: result.ImportoMaggiorazione}) ),
      catchError( (error) => {
        this.dialog.open(DialogComponent, {data: {title: 'Service Error', text: `Service Error Retry later \n ${error.error}` } })
        return of(orderActions.PreviewOrderFail())
      })
    ))
  ))

  getCategories$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetCategories),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([active, lang]) => this.api.getCategories(lang).pipe(
      map( (r: ICategory[] ) => orderActions.GetCategoriesSuccess({payload: r}) ),
      catchError( () => of(orderActions.GetCategoriesFail() ) )
    ))
  ))

  getSearchItems$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetSearchItems),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], lang]) => this.api.getSearchOrderItems(positionCode, action.payload, lang).pipe(
      map( r => orderActions.GetSearchItemsSuccess({payload: r})),
      catchError( e => of( orderActions.GetSearchItemsFail()) ),
    ))
  ))

  itemOrderDetail$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetItemOrderDetail),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], lang]) => this.api.getOrderItemDetails(action.payload, positionCode, lang).pipe(
        map( result => orderActions.GetItemOrderDetailsSuccess({payload: result}) ),
        catchError( () => of(orderActions.GetItemOrderDetailsFail()) )
      )
    )
  ))

  itemSubtype$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetItemSubType),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, positionCode], lang]) => this.api.getRoomServiceDataArticlesArticle(lang, positionCode, action.payload, action.subType).pipe(
      map( result => orderActions.GetItemSubTypeSuccess({payload: result, types: action.payload}) ),
      catchError( () => of(orderActions.GetItemSubTypeFail()) )
    ))
  ))

  saveOrderSuccess$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.PlaceOrderSuccess),
    switchMap( result => {
      const _dialog = this.dialog.open(DialogComponent, {data: {title: '', text: `L'ordine è stato completato` } })
      return _dialog.beforeClosed();
    })
  ), {dispatch: false} )

  saveOrder$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.PlaceOrder),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(GetPositionCode) )),
    withLatestFrom( this.store.pipe( select(GetTableCode) )),
    switchMap( ([[[action, reservationInfos], positionCode], tableCode]) => this.api.saveOrder({...{}, 
      Sala: positionCode,
      Tavolo: tableCode,
      CodicePresenza: reservationInfos && reservationInfos.stayId || -1,
      CodiceAnagrafica: reservationInfos && reservationInfos.guestId || -1,
      ListOfDettagli: action.payload // groupArticles(
    }).pipe(
      map( result => orderActions.PlaceOrderSuccess() ),
      catchError( (error) => {
        const _dialog = this.dialog.open(DialogComponent, {data: {title: '', text: `${error.error}` } })
        return of(orderActions.PlaceOrderFail()) 
      })
    ))
  ))

  getMainCourses$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetMainCourses),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(GetOrderInfos) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[action, orderInfo],lang]) => this.api.getRoomServiceDataArticlesList(orderInfo.positionCode, lang).pipe(
      map( (result: IOrderItemLight[]) => orderActions.GetMainCoursesSuccess({payload: result}) ),
      catchError( (e) => of(orderActions.GetMainCoursesFail() ) )
    ))
  ))

  getAreas$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetPositions),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    switchMap( ([[action, lang], reservation] ) => this.api.getAreas(reservation?.stayId || -1, lang).pipe(
      map( e => orderActions.GetPositionsSuccess({payload: e})),
      catchError( () => of(orderActions.GetPositionsFail) )
    ))
  ))

  getAreasContent$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetPositionsContent),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    switchMap( ([[action, lang], reservation] ) => this.api.getAreaPositions( action.payload, reservation?.stayId || -1, lang).pipe(
      map( (e: IRoomPositions) => orderActions.GetPositionsContentSuccess({payload: e})),
      catchError( () => of(orderActions.GetPositionsContentFail) )
    ))
  ))

  checkQRCodeArea$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.CheckQRCodeArea),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(GetOrderInfos) )),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    switchMap( ([[[action, reservation], orderInfo],lang]) => this.api.checkAreaAvailability( reservation?.stayId || -1, action.payload, lang).pipe(
      map( (r) => orderActions.CheckQRCodeAreaSuccess({payload: r}) ),
      catchError( (e) => {
        this.dialog.open( DialogComponent, {data: {title: '', text: e.error} } );
        return of(orderActions.CheckQRCodeAreaFail() )
      })
    ))
  ))

  checkQRCodeAreaSuccess$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.CheckQRCodeAreaSuccess),
    map( ({payload}) => payload ),
    tap( payload => this.store.dispatch( orderActions.SetPositionInfo( {payload: payload} ) ) ),
    tap( payload => this.router.navigate([ 'app', 'order', payload.servicePositions[0].code, payload.resourceCode ]) )
  ), {dispatch: false})

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private actions$: Actions,
    private api: FetchService,
    private dialog: MatDialog
  ) {}
}

export function groupArticles (items: IOrderItemSemplify[]): any[] {
  return items.reduce( (acc, item, index, currentArray) => {
    const unit = currentArray.filter( i => i.Articolo === item.Articolo).length;
    const exist = !!( acc.find( (i: IOrderItemSemplify) => i.Articolo === item.Articolo ) );
    if(!exist) {
      return [...acc, ({...item, Quantita: unit } as never)];
    }
    return acc;
  }, [] );
}