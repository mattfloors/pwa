import { Inject, Injectable, isDevMode } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { groupBy } from 'lodash';
import { distinctUntilChanged, interval,merge, fromEvent, Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ISettings } from '../models/reservation.model';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { SetLanguage } from '../store/ui/actions';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private prefix = 'hc-';
  private color$ = new BehaviorSubject(['#cccccc', '#cccccc']);
  private settings$: BehaviorSubject<ISettings | any> = new BehaviorSubject({});
  private userSettings$:Subject<ISettings> = new Subject();
  private languageChanges$: BehaviorSubject<string> = new BehaviorSubject('it-IT');
  public Settings$: Observable<ISettings> = this.settings$.asObservable();
  public UserSettings$: Observable<ISettings> = this.settings$.asObservable();
  public Language$: Observable<string> = this.languageChanges$.asObservable();

  public Color$ = this.color$.asObservable().pipe(map( c => this.setColorPalette(c) ));
  // 'it-IT'
  
  // if (window.matchMedia('(display-mode: standalone)').matches) {
  //   console.log('display-mode is standalone');
  // }
  // I also recommend you listen for the appinstalled event, it’s fired when the user has installed your app, whether from your install promotion, or from Chrome.

  // window.addEventListener('appinstalled', (evt) => {
  //   console.log('a2hs installed');
  // })
  
  // if("getInstalledRelatedApps" in navigator) {
  //   // then... you can call navigator.getInstalledRelatedApps()
  //   const result = navigator.getInstalledRelatedApps();
  // }

  private setColorPalette(c: string[] | any[]) {
    return `:root{
      --color-primary-50: #ffebee;
      --color-primary-100: #ffcdd2;
      --color-primary-200: #ef9a9a;
      --color-primary-300: #e57373;
      --color-primary-400: #ef5350;
      --color-primary-500: #f44336;
      --color-primary-600: #e53935;
      --color-primary-700: #d32f2f;
      --color-primary-800: #c62828;
      --color-primary-900: #b71c1c;
      --color-primary-A100: #ff8a80;
      --color-primary-A200: #ff5252;
      --color-primary-A400: ${c[0]};
      --color-primary-A700: #d50000;
      --color-accent-A400: ${c[1]};
    }`;
  }
  public setColor(color: string[]) {
    return this.color$.next(color);
  }
  public getColor(): Observable<string[]> {
    return this.color$;
  }

  private settingState: any = {};

  public isOnline(): Observable<boolean> {
    return merge( 
      fromEvent(window, 'online').pipe( map( e => true )), 
      fromEvent(window, 'offline') .pipe( map( e => false )) 
    ).pipe( tap( r => {
      if(!r) {
        this.snackBar.open( this.translate.instant('OFFLINE_COPY') )
      } else{
        this.snackBar.dismiss()
      }
    } ),shareReplay() )
  }

  public isAppInstalled(): boolean {

    // For iOS
    if(this.platform.IOS && this.platform.SAFARI){
      if(window.navigator.hasOwnProperty('standalone') && (window.navigator as any).standalone ) return true
    }

    // For Android
    if(window.matchMedia('(display-mode: standalone)').matches) return true

    // If neither is true, it's not installed
    return false

  }

  public applySettings() {
    const settings = JSON.parse( sessionStorage.getItem('ui-settings') || '' );
    if(isDevMode()){
      console.log('applySettings', settings , 'true');
    }
    this.settings$.next(settings);
    this.setColor( [this.parseColorIntPackToHex(settings.primaryColor) , this.parseColorIntPackToHex(settings.secondaryColor)]);
  }

  public isAppInstalledState(): Observable<boolean> {
    return interval(1000).pipe( map( () => this.isAppInstalled()), distinctUntilChanged() )
  }

  public checkLanguage(lang: string) {
    
    switch (lang) {
      case 'it-IT':
      case 'it':
        return 'it-IT';
      case 'en-US':
      case 'en':
        return 'en-US';
      case 'fr-FR':
      case 'fr':
        return 'fr-FR';
      default:
        return 'en-US';
    }
  }

  public changeSettings(setting: any) {
    // console.log('changeSettings ',setting)
    this.settingState = {...this.settingState, ...setting};
    this.languageChanges$.next(this.settingState.language);
    // console.log(this.settingState.language)
    if(this.settingState.language !== localStorage.getItem(`${this.prefix}language`) && typeof this.settingState.language !== 'undefined'  ) {
    // console.log('changeSettings',this.settingState.language);
      localStorage.setItem(`${this.prefix}language`, this.settingState.language);
      this.store.dispatch( SetLanguage({payload: this.settingState.language}) );
      this.translate.use(this.settingState.language);
    }
    if(this.settingState.theme && this.settingState.theme === 2) {
      this.document.body.classList.add('dark-theme');
    }else{
      this.document.body.classList.remove('dark-theme');
    }
    this.saveSettings();
  }

  public setSettings(settings: ISettings) {
    this.settingState = settings;
    this.saveSettings();
    this.applySettings();
  }

  private saveSettings() {
    sessionStorage.setItem('ui-settings', JSON.stringify(this.settingState) );
  }

  public getSettings(key?: string): any {
    return key ? this.settingState[key] : this.settingState;
  }

  public isOpen(dayISO: number, timeRange: number[]): boolean {
    if( dayISO !== this.getNow('day') ) return false;
    const now = Number(this.getNow('time'));
    if(isDevMode()) {
      console.log('timeRange', now, timeRange, now >= timeRange[0] && now <= timeRange[1]);
    }
    // @todo REMOVE
    return true
    return now >= timeRange[0] && now <= timeRange[1];
  }

  public getNow(kind?: string): string | number {
    switch (kind) {
      case 'epoch':
        return new Date().toUTCString().valueOf().toString();
      case 'day':
        return new Date().getDay();
      case 'time': {
        const time = new Date().toLocaleTimeString().split(':');
        return `${time[0]}${time[1]}`;
      }
      default: 
        return new Date().toISOString().toString();
    }
    
  }

  public parseColorIntPackToHex(c: number): string {
    /**
     * Converte un colore dal formato server intPack (-16777216) al formato locale hex (#ffffff)
     *
     * @param color
     * @returns
     */
      const tmpIntColor = c;

      const tmpUnpackColor = [
        (tmpIntColor & 0xff000000) >> 24,
        (tmpIntColor & 0x00ff0000) >> 16,
        (tmpIntColor & 0x0000ff00) >> 8,
        (tmpIntColor & 0x000000ff)
      ];
      return `#${[tmpUnpackColor[1], tmpUnpackColor[2], tmpUnpackColor[3]].map(item => item.toString(16).padStart(2, '0')).join('')}`;

  }
  // public createPosStructureList(v: IOrderItem[] , flat?: boolean): IStoredMenu {
  //   const gbTypo = groupBy( v, 'OrdineTipo');
  //   let tipi = [];
  //   if(flat) {
  //     console.log('piatti');
  //     tipi = Object.keys(gbTypo).map(
  //       t => (console.log(t), t)
  //     ).map( (t, i) => ({Descrizione: gbTypo[t][0].Tipo, OrdineTipo: gbTypo[t][0].OrdineTipo}) );
  //   }else{
  //     console.log('piatti');
  //     tipi = v;
  //   }

  //   const subTipi = Object.entries(gbTypo).reduce( (acc, [tipo, piatti]) => {
  //     const keys = new Map();
  //     piatti.forEach(p => {
  //       const key = !!p.SubTipo ? p.SubTipo : `*${p.Tipo}`;
  //       keys.has(key) ? keys.set(key, [...keys.get(key), p]) : keys.set(key, [p]);
  //     });
  //     return ({
  //       ...acc, [tipo]: Array.from(keys.entries())
  //     })
  //   }, {});

  //   console.log(tipi, subTipi);

  //   return {tipi, subTipi};
  // }
  // public createPosStructure(v: IOrderItem[]): IStoredMenuList {
  //   const menu = v.filter(({Menu}) => !!Menu);
  //   const frequenti = v.filter(({Frequente}) => !!Frequente);
  //   const piatti = v.filter(({Menu, Frequente}) => !Menu && !Frequente);
  //   const keys: any[] = [
  //     {title: 'Piatti', key: "piatti"},
  //     {title: 'Menu', key: "menu"},
  //     {title: 'Frequenti', key: "frequenti"}
  //   ];
  //   // console.log(menu, frequenti, piatti);
  //   // console.log(tipi, subTipi);
  //   return { menu, frequenti, piatti, keys };
  // }

  getLanguage(): string {
    return localStorage.getItem(`${this.prefix}language`) || 'it-IT';
  }

  setDefaultLanguage(key: string): string {
    console.log('setDefaultLanguage ',key);
    let lang = localStorage.getItem(`${this.prefix}language`);
    if(!lang || lang === 'undefined') {
      lang = key;
      if(isDevMode()) {
        console.log('setDefaultLanguage ',key, lang);
      }
    }
    this.store.dispatch( SetLanguage({payload: lang}) );
    if(isDevMode()) {
      console.log('setDefaultLanguage 2',key, lang);
    }
    localStorage.setItem(`${this.prefix}language`, lang);
    return lang;
  }

  setSetting(key: string, value: any) {
    
  }

  setLanguage(lang: string): void {
    if(isDevMode()) {
      console.log('setLanguage ',lang)
    }
    localStorage.setItem(`${this.prefix}language`, lang);
    this.languageChanges$.next(lang);
    this.translate.use(lang);
    if(isDevMode()) {
      console.log('setLanguage', lang);
    }
    this.store.dispatch( SetLanguage({payload: lang}) );
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<AppState>,
    private platform: Platform, 
    private translate: TranslateService, 
    private snackBar: MatSnackBar,
  ) { 
    if( this.platform.isBrowser ) {
      const initialLanguage = this.setDefaultLanguage( this.checkLanguage(navigator.language) );
      this.translate.setDefaultLang(initialLanguage);
      this.languageChanges$.next(initialLanguage);
      this.changeSettings( JSON.parse(sessionStorage.getItem('ui-settings') || '{}') );
    }
  }
}
