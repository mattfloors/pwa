import { Injectable } from "@angular/core";
import * as orderActions from "./actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, of } from "rxjs";
import { catchError, tap, map, switchMap, withLatestFrom } from "rxjs/operators";
import { FetchService } from "../../services/fetch.service";
import { AppState } from "..";
import { Store, select } from "@ngrx/store";
import { GetLanguage, GetReservationInfos } from "../ui/selectors";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class SurveyEffects {

  setSurvey$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.SetSurvey),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    switchMap( ([{payload}, reservationInfo]) => this.api.setSurvey(
      {
        stayId: reservationInfo?.stayId || -1,
        surveyData: payload
      }).pipe(
        map( res => typeof res === 'boolean' ? orderActions.SetSurveySuccess({payload: payload, result: res}) : orderActions.SetSurveyFail({payload: res}) ),
        catchError( (e) => of(orderActions.SetSurveyFail(e.error.text)) )
      )
    )
  ))

  getSurvey$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.GetSurvey),
    withLatestFrom( this.store.pipe( select(GetLanguage) )),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    switchMap( ([[action, language], reservation]) => this.api.getSurvey(reservation?.stayId || -1, language).pipe(
      map( res => Array.isArray(res) ? orderActions.GetSurveySuccess({payload: res}) : orderActions.GetSurveyFail({payload: res}) ),
      catchError( (e) => of(orderActions.GetSurveyFail({payload: e.error.text})) )
    ))
  ))

  setSurveyFail$ = createEffect( () => this.actions$.pipe(
    ofType(orderActions.SetSurveyFail),
    map( ({payload}) => {
      this.dialog.open( DialogComponent, {data: {text: `${payload}`, title: 'Error'}} );
    } )
  ),{dispatch: false})

  


  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private api: FetchService,
    private router: Router,
    private dialog: MatDialog
  ) {}
}
