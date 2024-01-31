import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, of, shareReplay, Subject } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { FetchService } from './fetch.service';
/**
 * @description Servizio che include i metodi che gestiscono la persistenza della sessione lo stato di loggato e non loggato
 *//**
 * aG90ZUlkPTIwMDAmcm9vbUlkPTQwMDA=
 * aG90ZUlkPTIwMDA=
 */
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token!: string;
  private hotelId: string = ''; //JSON.parse( sessionStorage.getItem('INIT_URL') || '{}' )?.h;
  private reservationId: string = ''; //JSON.parse( sessionStorage.getItem('INIT_URL') || '{}' )?.t || JSON.parse( sessionStorage.getItem('INIT_URL') || '{}' )?.Id || JSON.parse( sessionStorage.getItem('INIT_URL') || '{}' )?.id;
  

  /**
   * 
   * Prenotazione attiva TOSCANO VINCENZO
   * %2fy6zRs0AG1j1NHwa4Kvs16MnlKIS8nGuMs85nrnFBl0%3d
   * ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&Id=%2fy6zRs0AG1j1NHwa4Kvs16MnlKIS8nGuMs85nrnFBl0%3d
   * Cliente InCasa PETTINE
   * 3OBBz2VXVSi109vsQLLGbXbp3222yi4E7lw9fKSYo1c%3d
   * ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=3OBBz2VXVSi109vsQLLGbXbp3222yi4E7lw9fKSYo1c%3d

   * Preno Cancellata MAR BRENTON
   * ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=zuvGAgSCeZEL1E3kNeBL0oMYjjGQ%2fKguL%2bKw84fyJr4%3d

   * Cliente partita con survey attivo Michielin Arduino
   * I30TPf56Iqu4ULsz7gB7CA%2bK9Vz4qua4FPPg570tNp4%3d
   * ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=I30TPf56Iqu4ULsz7gB7CA%2bK9Vz4qua4FPPg570tNp4%3d

   * PrenoNonValida (di altro hotel)
   * Hotel: xR6WEIzwWpZTcXvnyE0Ljg%3d%3d
   * Id: Oil2jQ52XBThwt0%2fqi1l44oqSUkAMiziAr0lH3KsVd4%3d
   * ?h=xR6WEIzwWpZTcXvnyE0Ljg%3d%3d&id=Oil2jQ52XBThwt0%2fqi1l44oqSUkAMiziAr0lH3KsVd4%3d
   */

  private processing$ = new BehaviorSubject(true);
  public Processing$ = this.processing$.asObservable();

  private session$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public SessionState$: Observable<boolean> = this.session$.asObservable();

  private accessKey = '';

  setAccessKey(key: string) {
    this.accessKey = key;
  }

  getAccessKey() {
    return this.accessKey;
  }

  setHotelId(token: string) {

    this.hotelId = token;
  }
  setReservationId(token: string) {

    this.reservationId = token;
  }

  removeReservationId() {
    // this.reservationId = '';
    // sessionStorage.getItem('INIT_URL');
  }

  retriveInfos() {
    return this.getInitialUrl();
  }

  setSession(result: boolean) {
    this.session$.next(true);
  }
  setInitialUrl(token: any) {

    sessionStorage.setItem('INIT_URL', JSON.stringify(token) );
    localStorage.setItem('INIT_URL', JSON.stringify(token) );
  }
  getInitialUrl() {
    return sessionStorage.getItem('INIT_URL');
  }
  needToLogin() {
    return false;
  }
  isAuthenticated(): boolean {
    // console.log('isAuthenticated',!!(sessionStorage.getItem('LOGGEDIN')) );
    return !!(sessionStorage.getItem('LOGGEDIN'));
  }
  hasReservation(token: string): Observable<number> {
    return this.api.getParsedToken(token);
  }
  getReservationId() {
    return this.reservationId || '';
  }
  getHotelId() {
    return this.hotelId;
  }
  parseToken(queryParams: ParamMap): string[] {
    this.requestToken().subscribe( console.log );
    return [this.hotelId, this.reservationId].filter(a => a);
  }

  isFullLogged() {
    // console.log('isFullLogged', this.reservationId , this.hotelId);
    return this.reservationId && this.hotelId;
  }
  
  requestToken(): Observable<string> {
    // console.log('4', this.getHotelId(), this.getReservationId(), this.getAccessKey());
    return this.api.getAccess(this.getHotelId(), this.getReservationId(), this.getAccessKey() ).pipe(
      tap( token => this.setToken(token) ),
      catchError( (error) => {

        // this.dialog.open(DialogComponent, {data: {title: '', text: error.error} })
        return of(error);
      })
    );
  }
  getToken() {
    return sessionStorage.getItem('HC-TOKEN');
  }
  setToken(token: string) {
    sessionStorage.setItem('HC-TOKEN', token);
  }
  logIn(credential: any[]): Observable<boolean> {
    return of(true);
  }
  logOut(): void {
    sessionStorage.removeItem('LOGGEDIN');
  }
  constructor( private api: FetchService, private dialog: MatDialog) {}
}
