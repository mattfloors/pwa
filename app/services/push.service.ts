import { Injectable, isDevMode } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, catchError, of } from 'rxjs'
import { tap, map, switchMap, delay, take } from 'rxjs/operators'
import { GetUnits, SetMessageToken } from '../store/messages/actions';
import { SubscribeToken } from '../store/ui/actions';
import { GetReservationInfos } from '../store/ui/selectors';
import { AppState } from './../store/index';
@Injectable()
export class MessagingService {
public CurrentMessage: any | null = new BehaviorSubject(null);
constructor(private messaging: AngularFireMessaging, private store: Store<AppState>) {}

requestPermission() {
  this.messaging?.requestPermission.pipe(
    delay(2000),
    switchMap( () => this.messaging.getToken.pipe( 
      map(r => r || '')) ),
    tap( token => {

      localStorage.setItem('MESSAGE_SESSION_TOKEN', token)
    }),
    tap( (t :string | any) => this.store.dispatch( SubscribeToken({payload: {SubscriptionToken: (t || '')}})) ),
    catchError( (error) => {
      console.log('catchError', error)
      // alert('By not accepting the notifications you will not be able to receive updates on the receipt of messages');
      return of(false);
    }),
    take(1)
  ).subscribe( )
  // this.messaging.requestToken.subscribe(
  //   (token) => { console.log(token); },
  //   (err) => { console.error('Unable to get permission to notify.', err); }
  // );
}
receiveMessage() {
  this.messaging.messages.pipe(
    // tap( () => console.log('message received') ),
    tap( console.log ),
    // tap( () => console.log('end message received') ),
  ).subscribe(
    (payload) => {
      console.log("new message received. ", payload);
      this.store.dispatch( GetUnits() );
      this.CurrentMessage.next(payload);
    })
  }
}