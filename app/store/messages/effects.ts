import { Injectable } from "@angular/core";
import * as messagesActions from "./actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, of } from "rxjs";
import { catchError, map, tap, filter, switchMap, withLatestFrom } from "rxjs/operators";
import { FetchService } from "../../services/fetch.service";
import { AppState } from "..";
import { Store, select } from "@ngrx/store";
import { GetLanguage, GetReservationInfos, GetReservationState } from "../ui/selectors";
import * as fromSelectors from './selectors';
import { IUnitsPayload, MessagesPayload } from "../../models/messages.model";

@Injectable({providedIn: 'root'})
export class MessagesEffects {

  // GetUnits
  /** @TODO check with other */
  // units need to check if there's some new messages to read
  getUnits$ = createEffect( () => this.actions$.pipe(
    ofType(messagesActions.GetUnits),
    withLatestFrom( this.store.pipe( select(GetReservationInfos))),
    withLatestFrom( this.store.pipe( select(GetReservationState))),
    withLatestFrom( this.store.pipe( select(GetLanguage))),
    map( ([[[a,b],c], l]) => {
      const payload = c === 'INHOUSE' ? {stayId: b?.stayId} : {reservationId: b?.reservationId};
      return [payload, l]
    }),
    switchMap( ([payload, language]) => this.api.getUnits((payload as IUnitsPayload), language as string ).pipe(
      map( response => messagesActions.GetUnitsSuccess({payload: response}) ),
      catchError( () => of(messagesActions.GetUnitsFail()) )
    ))
  ))

  // SendMessages
  // must send just one element at the time
  sendMessages$ = createEffect( () => this.actions$.pipe(
    ofType(messagesActions.SendMessage),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(fromSelectors.GetCurrentArea) )),
    withLatestFrom( this.store.pipe( select(fromSelectors.GetMessages) )),
    tap( ([[[action, reservation], area], messages]) => console.log({
      action, reservation, area, messages
    }) ),
    map( ([[[action, reservation], area], messages]) => {
      const payload = reservation?.reservationState === 'INHOUSE' ? {stayId: reservation?.stayId} : {reservationId: reservation?.reservationId};
      return new MessagesPayload( payload, area, [ action.payload ] )
    }),
    tap( () => console.log),
    switchMap( payload => this.api.addMessage(payload).pipe(
      map( response => messagesActions.SendMessageSuccess( {payload: payload} ) ),
      catchError( () => of( messagesActions.SendMessageFail() ) )
    ))
  ))

  // OpenedMessages
  // the opened messages need just send the ids
  openedMessages$ = createEffect( () => this.actions$.pipe(
    ofType(messagesActions.OpenedMessages),
    withLatestFrom( this.store.pipe( select(GetReservationInfos) )),
    withLatestFrom( this.store.pipe( select(fromSelectors.GetCurrentArea) )),
    withLatestFrom( this.store.pipe( select(fromSelectors.GetMessages) )),
    filter( ([[[action, reservation], area], messages]) => (area && area?.NewMessages || 0) > 0 ),
    map( ([[[action, reservation], area], messages]) => {
      const payload = reservation?.reservationState === 'INHOUSE' ? {stayId: reservation?.stayId} : {reservationId: reservation?.reservationId};
      return new MessagesPayload( payload, area, action.payload?.length ? action.payload : messages )
    }),
    switchMap( payload => this.api.openedMessage({...payload}).pipe(
      map( response => messagesActions.OpenedMessagesSuccess({payload: payload.messages[payload.messages.length -1]?.id || -1}) ),
      catchError( () => of(messagesActions.OpenedMessagesFail()) )
    ))
  ))

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private api: FetchService
  ) {}
}