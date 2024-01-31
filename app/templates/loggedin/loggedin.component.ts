import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, forkJoin, Subject, of } from 'rxjs';
import { map, tap, filter, shareReplay, withLatestFrom } from 'rxjs/operators';
import { IReservation, ISettings } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../store';
import { GetTotalMessages } from '../../store/messages/selectors';
import { GetReservation, GetSettings, GetVersion } from '../../store/ui/actions';
import { GetCurrentPage, GetLanguage, GetLanguages, GetNavigation, GetReservationInfos, GetSettingsInfos } from '../../store/ui/selectors';
import { CURRENCY, Currency } from '../../tokens/localization.tokens';
import { StoreService } from './../../services/store.service';
import { UiService } from './../../services/ui.service';
import { TabNavigationContentComponent } from './../../shared/tab-navigation/tab-navigation-content/tab-navigation-content.component';
import { GetUnits } from '../../store/messages/actions';
import { MessagingService } from '../../services/push.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetOrderFullInfo, GetOrderInfo, GetOrderPageInfo } from '../../store/orders/selectors';
  
@Component({
  selector: 'app-loggedin',
  templateUrl: './loggedin.component.html',
  styleUrls: ['./loggedin.component.scss'],
  providers: [
    { provide: CURRENCY , useClass: Currency },
  ]
})
export class LoggedInComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Hey! Guest';
  public currentLanguage = navigator.language;
  public Services$!: Observable<any[]>;
  public Settings$!: Observable<any>;
  public Navigation$!: Observable<any[] | null>;
  public ServicesArray!: any[];
  public ImageSrc$ = this.uiService.Settings$.pipe( map(e => e.logo ), tap(console.log), shareReplay(1) );
  public Form: FormGroup = this.fb.group({
    language: this.fb.control(''),
    theme: this.fb.control('')
  });
  public Language$: Observable<string> = this.store.pipe( select( GetLanguage), map( r => !r ? 'en-US' : r) );
  public Languages$: Observable<any[]> = this.store.pipe( select( GetLanguages) ); // [{name: 'it-IT',value: 'it-IT'},{name: 'en-US',value: 'en-US'}];
  public readonly Themes: any[] = [{name: 'LIGHT_MODE', value: 1}, {name: 'DARK_MODE', value: 2}];
  public readonly RemovedItems: string[] = ['messages'];
  public MessagesCount$: Observable<number> = this.store.pipe( select(GetTotalMessages) );
  public HasFunctionMessage: boolean = false;

  public ToolbarTitle$!:Observable<string>;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild( MatDrawer, {static: false, read: MatDrawer} ) drawer!: MatDrawer;
  toggleDrawer() {
    this.drawer.toggle();
  }
  openBottomSheet() {
    this.bottomSheet.open(TabNavigationContentComponent, {data: this.ServicesArray});
  }
  ngOnInit() {
    

    this.store.dispatch( GetVersion() );
    this.afMessaging.requestPermission();
    this.afMessaging.receiveMessage();


    // this.Services$ = combineLatest([this.store.HCServices$, this.uiService.Settings$]).pipe( tap(console.log), tap(e => this.ServicesArray = e));
    this.Navigation$ = combineLatest([ this.storeService.HCNavigation$ , this.store.pipe(select(GetNavigation))]).pipe(
      map(( [paths, functions]) => functions && functions.map( f => {
        const p: any = paths.find( p => p.key === f.functionName );
        if(p) {
          return ({...f, path: p.path.toLowerCase(), icon: p.icon}) 
        }else{
          return f;
        }
      } )),
      tap( r => this.HasFunctionMessage = !!r.find( p => p.functionName === 'MESSAGES') ),
      map( r => r && r.filter( p => !this.storeService.HcNavigationRemove.includes(p.functionName) ) ),
      tap(r => r && ( this.ServicesArray = [...r].splice(4) )),
      shareReplay()
    );

    this.store.pipe(select(GetReservationInfos)).pipe(filter( r => !(r)) ).subscribe( r => this.store.dispatch( GetReservation( {payload: {[this.auth.getAccessKey()]: this.auth.getReservationId()} } ) ) )
    // ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=3OBBz2VXVSi109vsQLLGbXbp3222yi4E7lw9fKSYo1c%3d
    // combineLatest([
    //   this.storeService.HCNavigation$,
    //   this.uiService.Settings$.pipe(map(s => s.activeFunctions))
    // ]).pipe( 
    //   tap(console.log),
    //   map( ([n, l]) => n.filter( (i: any) => l.find((s: any) => s.functionName === i.key) ).filter( (g: any) => !this.RemovedItems.includes(g.name) ) ), 
    // tap(console.log),
    // tap(r => this.ServicesArray = [...r].splice(4) ) );

    // if( !this.uiService.isAppInstalled() ) {
    //   alert('install the app');
    // }

    // this.getData();

    this.translateService.onLangChange.pipe(
      tap( () => {

        if( this.auth.isFullLogged() ) {
          this.store.dispatch( GetReservation( {payload: {[this.auth.getAccessKey()]: this.auth.getReservationId()} } ) );
        }else{
          this.store.dispatch( GetReservation( {payload: {[this.auth.getAccessKey()]: this.auth.getReservationId()} } ) );
        }

      })
    ).subscribe()

    
    this.Language$.subscribe( l => 
      this.Form.get('language')?.patchValue(l, {emitEvent: false})
    )
    this.Form.get('theme')?.patchValue(this.uiService.getSettings('theme') || 1);
    this.Form.valueChanges.subscribe( v => this.uiService.changeSettings(v) );
    // if( this.auth.isFullLogged() ) {
    //   this.store.dispatch( GetReservation( {payload: {[this.auth.getAccessKey()]: this.auth.getReservationId()} } ) );
    // }else{
    //   
    // }
    this.store.pipe(select(GetReservationInfos)).subscribe(
      r => this.storeService.setHomePage(r as IReservation)
    )
    combineLatest([this.store.pipe(select(GetReservationInfos)), this.store.pipe(select(GetSettingsInfos) )]).pipe(
      filter( ([r,s]) => !!(r) && !!(s) )
    ).subscribe(
      ([r,s]) => {
        
        this.uiService.setSettings({...(s as ISettings), logo: `data:image/png;base64,${s && s.logo}` });
        this.currency.value = s?.currencySimbol || 'cu';
        if( r?.avaibleFunctions.includes('MESSAGES') ) {
          this.store.dispatch( GetUnits() )
        }
      }
    );

    this.route.data
      .pipe(
        withLatestFrom( this.Navigation$ ),
        tap( ([d, n]) => {
          const firstTimePage = d['Data']['functionName'];
          if (firstTimePage !== 'WELCOME') {
            const path = n?.find( p => p.functionName === firstTimePage );
            this.router.navigate( [ 'app' , path.path] );
          }
        })
      )
      .subscribe( 
        
      )

  }
  ngAfterViewInit() {
    this.ToolbarTitle$ = combineLatest([ 
      this.Navigation$, 
      this.store.pipe(select(GetCurrentPage)),
      this.store.pipe( select(GetOrderFullInfo) ),
      this.store.pipe( select(GetOrderInfo) ),
      this.store.pipe( select(GetOrderPageInfo) )
    ]).pipe(
      map(([r, p, o, info, other]) => {
        const retriveFromPath = r?.find( (rou: any) => rou.path.toLowerCase() === p.toLowerCase() );
        if(p === 'welcome'){
          return 'Hey! Guest'
        }
        if(p === 'meteo'){
          return retriveFromPath?.name;
        }
        if(p === 'messages'){
          return retriveFromPath?.name;
        }
        if(p === 'survey'){
          return retriveFromPath?.name;
        }
        if(p === 'services'){
          return retriveFromPath?.name;
        }
        if(p === 'orders'){
          const innerRetriveFromPath = r?.find( (rou: any) => rou.path.toLowerCase() === 'order' );
          return innerRetriveFromPath?.name;
        }
        if(p === 'order'){
          
          if( o.description === 'RoomService' ) {
            return `${this.translateService.instant('ROOM')} ${other?.Room}`;
          }else{
            return o.description;
          }
        }
        return 'Hey! Guest';
      })
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  // getData() {
  //   this.api.getConfiguration().subscribe( (s) => {
  //     this.uiService.setSettings({...s, logo: `data:image/png;base64,${s.logo}` });
  //   });
  //   this.api.getReservation(this.auth.getReservationId()).subscribe( ( r ) => this.storeService.setHomePage(r) );
  // }

  constructor(
    @Inject(CURRENCY) private currency: Currency,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private afMessaging: MessagingService,
    private store: Store<AppState>, 
    private storeService: StoreService, 
    private uiService: UiService, 
    private fb: FormBuilder, 
    private bottomSheet: MatBottomSheet,
    private auth: AuthService
  ) {}
}
