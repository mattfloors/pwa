import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, shareReplay, Subject, combineLatest } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { IMessages } from '../models/messages.model';
import { IReservation, ISettings, IApplicationState } from '../models/reservation.model';
@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // private readonly hcReservation: IReservation = {"avaibleFunctions":["WELCOME","MESSAGES","WEBCHECKIN","HOTEL_SERVICE","METEO"],"arrive":"2022-06-30T00:00:00","departure":"2022-07-01T00:00:00","guestName":"Vincenzo","guestSurname":"Toscano","totalGuestsNumber":2,"mealPlan":"Camera e Colazione","roomType":"JUNIOR SUITE","totalStayAmount":"€ 1,000.00","reservationState":"RESERVED","urlWebCheckin":"https://hc-test-weu-app-wci-01.azurewebsites.net/?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=%2fy6zRs0AG1j1NHwa4Kvs16MnlKIS8nGuMs85nrnFBl0%3d"}
  private homePageContent$: Subject<IReservation> = new Subject<IReservation>();
  private homePageContentState$ = this.homePageContent$.asObservable();
  private reservation!: IReservation;

  private toolbarTitle$: BehaviorSubject<string> = new BehaviorSubject('Hey! Guest');
  public ToolbarTitle$ = this.toolbarTitle$.asObservable();

  private userReservation$: Subject<IReservation> = new Subject();
  private applicationSettings$: Subject<ISettings> = new Subject();

  private userReservationState$: Observable<IReservation> = this.userReservation$.asObservable();
  private applicationSettingsState$: Observable<ISettings> = this.applicationSettings$.asObservable();

  private state$: Observable<IApplicationState> = combineLatest([this.userReservationState$, this.applicationSettingsState$]).pipe(
    filter(([reservation, settings]) => !!(reservation && settings)),
    map( ([reservation, settings]) => {
      return {
        ...{},
        activeFunctions: settings.activeFunctions.filter( f => reservation.avaibleFunctions.includes(f.functionName) ) || [],
        guestId: reservation.guestId,
        stayId: reservation.stayId,
        reservationId: reservation.reservationId,
        roomNumber: reservation.roomNumber,
        urlWebCheckin: reservation.urlWebCheckin,
        urlWebCheckOut: reservation.urlWebCheckOut
      } as IApplicationState;
    } )
  );

  setHomePage(content: IReservation) {
    this.reservation = content;
    this.homePageContent$.next(content);
  }

  public getReservation() {
    return this.reservation;
  }

  //#region Dummy Reservation
  // activeFunctions
  // languagesList

  public HCReservation$: Observable<IReservation> = this.homePageContentState$.pipe( shareReplay() );
  //#endregion

  //#region Dummy Navigation
  private readonly hcNavigation = [
    { key: 'WELCOME', path: 'welcome', icon: 'home_outline', name: 'home', data: false}, 
    { key: 'MESSAGES', path: 'messages', icon: 'message_outline', name: 'messages', data: true},
    { key: 'ROOM_SERVICE', path: 'room_service', icon: 'room_service', name: 'room service', data: false}, 
    { key: 'SERVICES', path: 'order', icon: 'fastfood_outline', name: 'order', data: false},
    { key: 'METEO', path: 'meteo', icon: 'wb_sunny_outline', name: 'meteo', data: false}, 
    { key: 'HOTEL_SERVICE', path: 'services', icon: 'receipt_outline', name: 'services', data: false},
    { key: 'WEBCHECKIN', path: 'checkin', icon: 'login_outline', name: 'checkin', data: false},
    { key: 'WEBCHECKOUT', path: 'checkout', icon: 'logout_outline', name: 'checkout', data: false},
    { key: 'SURVEY', path: 'survey', icon: 'add_reaction_outline', name: 'survey', data: false},
  ];

  public readonly HcNavigationRemove = ['MESSAGES'];

  public HCNavigation$ = of(this.hcNavigation).pipe( shareReplay() );
  //#endregion
  public getLanguages() {}
  public CurrentLanguage(): string {
    return this.getLanguage();
  }

  private getLanguage(): string {
    return 'en-US';
  }
  
  constructor() { }

}
