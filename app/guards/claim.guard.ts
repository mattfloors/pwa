import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, from, iif, Observable, of, switchMap } from 'rxjs';
import { map, tap, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { FetchService } from '../services/fetch.service';
import { isEmpty, tail } from 'lodash';
import { FakeCache } from '../services/cache.service';


@Injectable({
  providedIn: 'root'
})
export class ClaimGuard implements CanActivate {
  constructor(private router: Router, private cacheApi: FakeCache, private authService: AuthService, private api: FetchService) {}
  
  private readStorage(item: any) {
    // console.log('readStorage', item);
    let itemUrl = {};
    if( item.hasOwnProperty('h') ) {
      this.authService.setHotelId( item.h || '' );
      itemUrl = {...itemUrl, h: item.h };
    }
    if( item.hasOwnProperty('id') || item.hasOwnProperty('Id')  ) {
      this.authService.setAccessKey('id')
      this.authService.setReservationId( item.id || item.Id || '')
      itemUrl = {...itemUrl, id: item.id || item.Id };
    }
    if( item.hasOwnProperty('t') ) {
      this.authService.setAccessKey('stayid')
      this.authService.setReservationId(item.t || '')
      itemUrl = {...itemUrl, t: item.t };
    }
    return itemUrl;
  }

  private parseUrl(route: ActivatedRouteSnapshot) {
    
    const url = ( location.search && tail(location.search.split(/[?&=]+/)) ) || (!isEmpty(route.queryParams) && route.queryParams);
    // console.log('qui -1', location);
    if( url ) {
      // console.log('qui 0')
      if( !isEmpty(route.queryParams) ) {
        // console.log('qui 1')
        let itemUrl = {};
        //keys h Id
        if( route.queryParamMap.has('h') ) {
          // console.log('start set hotel id');
          this.authService.setHotelId( route.queryParamMap.get('h') || '' );
          itemUrl = {...itemUrl, h: route.queryParamMap.get('h') };
        }
        if( route.queryParamMap.has('id') || route.queryParamMap.has('Id')  ) {
          // console.log('start set id');
          this.authService.setAccessKey('id')
          this.authService.setReservationId( route.queryParamMap.get('id') || route.queryParamMap.get('Id') || '')
          itemUrl = {...itemUrl, id: route.queryParamMap.get('id') || route.queryParamMap.get('Id') };
        }
        if( route.queryParamMap.has('t') ) {
          // console.log('start set stay id');
          this.authService.setAccessKey('stayid')
          this.authService.setReservationId(route.queryParamMap.get('t') || '')
          itemUrl = {...itemUrl, t: route.queryParamMap.get('t') };
        }
        if( ! route.queryParamMap.has('t') && ! route.queryParamMap.has('id') && ! route.queryParamMap.has('Id') ) {
          // sessionStorage.removeItem('LOGGEDIN');
          // console.log('no stay or reservation')
          sessionStorage.setItem('INIT_URL', JSON.stringify(itemUrl) );
          localStorage.setItem('INIT_URL', JSON.stringify(itemUrl) );
          this.cacheApi.saveToken(JSON.stringify(itemUrl)).then();
          return false;
        }
        
        sessionStorage.setItem('INIT_URL', JSON.stringify(itemUrl) );
        localStorage.setItem('INIT_URL', JSON.stringify(itemUrl) );
        this.cacheApi.saveToken(JSON.stringify(itemUrl)).then();
        return true;
      }
    }else{
      const fromStorage = sessionStorage.getItem('INIT_URL') || localStorage.getItem('INIT_URL');
      if( !isEmpty( fromStorage ) ) {
        this.readStorage( JSON.parse( fromStorage || '' ) );
        return true;
      }
    }
    return false;
  }
  private requestUrl(route: ActivatedRouteSnapshot): Observable<boolean> {
    const result = this.parseUrl(route);

    if(result) {
      return this.authService.requestToken().pipe( map( r => true) )
    } else{
      return from(this.cacheApi.getToken()).pipe(
        map( token => {
          if(token){
            this.readStorage(JSON.parse(token));
            return true;
          }
          return false;
        }),
        switchMap( r => this.authService.requestToken().pipe( map( r => true) ) )
      );
    }
  }

  private isMainPage(): boolean {
    console.log(
      'check',
      window.matchMedia('(display-mode: standalone)').matches,
      window.matchMedia('(display-mode: standalone)'),
      location.href === `${location.origin}/`,
      !window.matchMedia('(display-mode: standalone)').matches && location.href === `${location.origin}/`,
    )
    return !window.matchMedia('(display-mode: standalone)').matches && location.href === `${location.origin}/`;
  }

  canActivate( 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return of( this.authService.getToken() ).pipe(
        switchMap( (t) => {
          return iif( () => !!(t), 
            of(true).pipe(
              tap( () => {
                if(this.isMainPage()){
                  console.log('redirect to expired 1', state.url)
                  this.router.navigate(['/', 'expired']);
                }else{

                  const result = this.parseUrl(route);
                  // console.log('can proceed 2', result);
                  if(state.url !== '/app'){
                    this.router.navigate(['/','app']);
                  }
                }

              })
            ),
            of(t).pipe( switchMap( () => this.requestUrl(route).pipe( tap(r => {
              // console.log(r);
              if(this.isMainPage()){
                // console.log('redirect to expired 2')
                this.router.navigate(['expired']);
              }
              if(!r) {
                if( !!(this.authService.getHotelId()) ) {
                  console.log('here')
                  this.router.navigate(['/','login']);
                }else{
                  this.router.navigate(['expired']);
                }
              }
            }) ) ) ),
          );
        })
      )
  }

}
