import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import { catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { AppState } from "..";
import { AuthService } from "../../services/auth.service";
import { FakeCache } from "../../services/cache.service";
import { FetchService } from "../../services/fetch.service";
import * as settingsActions from './actions';
import { GetLanguage, GetReservationKey } from "./selectors";

@Injectable({providedIn: 'root'})
export class SettingsEffects {

  getVersion$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetVersion),
    switchMap( () => this.api.getVersion().pipe(
      map( res => settingsActions.GetVersionSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetVersionFail() ) )
    ))
  ));

  getSettings$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetSettings),
    switchMap( () => this.api.getConfiguration().pipe(
      map( res => settingsActions.GetSettingsSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetSettingsFail() ) )
    ))
  ));

  getReservation$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetReservation),
    withLatestFrom( this.store.pipe( select(GetLanguage))),
    switchMap( ([{payload}, lang]) => this.api.getReservation(payload, lang).pipe(
      map( res => settingsActions.GetReservationSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetReservationFail() ) )
    ))
  ));

  userLogin$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.UserLogin),
    /** An EMPTY observable only emits completion. Replace with your own observable stream */
    switchMap( (action) => this.api.login(action.hotelId, action.reservationId, action.surname).pipe(
      tap( token => { this.auth.setToken(token), sessionStorage.setItem('LOGGEDIN',"true") }),
      map( token => settingsActions.UserLoginSuccess({payload: token, reservationId: action.reservationId}) ),
      catchError( r => of( settingsActions.UserLoginFail({payload: r.error}) ) )
    ) )
  ));

  userLoginSuccess$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.UserLoginSuccess),
    /** An EMPTY observable only emits completion. Replace with your own observable stream */
    switchMap( (action) => this.api.getReservationAfterLogin(action.reservationId).pipe(
      tap( () => {
        // modify initial url action.reservationId
        let initialUrl = {};
        this.auth.setAccessKey('reservationId');
        if(sessionStorage.getItem('INIT_URL')){
          initialUrl = JSON.parse( sessionStorage.getItem('INIT_URL') || '' ) || {};
        }else{
          initialUrl = JSON.parse( localStorage.getItem('INIT_URL') || '' ) || {};
        }
        sessionStorage.setItem('INIT_URL', JSON.stringify( {...initialUrl, id: action.reservationId}) );
        localStorage.setItem('INIT_URL', JSON.stringify( {...initialUrl, id: action.reservationId}) );
        this.cacheApi.saveToken(JSON.stringify(initialUrl)).then();
      }),
      tap( () => this.auth.setReservationId( action.reservationId.toString() ) ),
      tap( () => console.log('done') ),
      map( token => settingsActions.GetReservationSuccess({payload: token, redirect: true}) ),
      catchError( r => of( settingsActions.GetReservationFail() ) )
    ) )
  ));

  getReservationSuccess$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetReservationSuccess),
    tap((e) => console.log(e, 'GetReservationSuccess')),
    tap( e => 
      {
        if(e.redirect){
          this.router.navigate(['/', 'app' , 'welcome']) 
        }
        return e;
      }),
  ), {dispatch: false});

  getReservationFail$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetReservationFail),
    tap( () => this.auth.removeReservationId() )
  ), {dispatch: false});

  getMeteo$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetMeteo),
    withLatestFrom( this.store.pipe( select(GetLanguage))),
    switchMap( ([action, lang]) => this.api.getMeteo(lang).pipe(
      map( res => settingsActions.GetMeteoSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetMeteoFail() ) )
    ))
  ));

  getServices$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetServices),
    withLatestFrom( this.store.pipe( select(GetLanguage))),
    switchMap( ([action, lang]) => this.api.getServices(lang).pipe(
      map( res => settingsActions.GetServicesSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetServicesFail() ) )
    ))
  ));

  getService$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.GetService),
    withLatestFrom( this.store.pipe( select(GetLanguage))),
    switchMap( ([{payload}, lang]) => this.api.getService(payload, lang).pipe(
      map( res => settingsActions.GetServiceSuccess({payload: res}) ),
      catchError( e => of( settingsActions.GetServiceFail() ) )
    ))
  ));

  subscribeToken$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.SubscribeToken),
    withLatestFrom( this.store.pipe( select(GetReservationKey))),
    switchMap( ([{payload}, event]) => this.api.subscribeToken({...event, ...payload}).pipe(
      map( res => settingsActions.SubscribeTokenSuccess() ),
      catchError( e => of( settingsActions.SubscribeTokenFail() ) )
    ))
  ));

  unsubscribeToken$ = createEffect( () => this.actions$.pipe(
    ofType(settingsActions.UnSubscribeToken),
    withLatestFrom( this.store.pipe( select(GetReservationKey))),
    switchMap( ([{payload}, event]) => this.api.unSubscribeToken({...event, ...payload}).pipe(
      map( res => settingsActions.UnSubscribeTokenSuccess() ),
      catchError( e => of( settingsActions.UnSubscribeTokenFail() ) )
    ))
  ));

  constructor(
    private auth: AuthService,
    private cacheApi: FakeCache,
    private api: FetchService,
    private store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
  ) {}

}

