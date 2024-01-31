import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { isEmpty, tail } from 'lodash';
import { AuthService } from '../services/auth.service';
import { FakeCache } from '../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cacheApi: FakeCache, private authService: AuthService) {}
  private readStorage(item: any) {
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
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(isDevMode()) {
        console.log('start');
      }
      let astate: any = {}
      const storage = sessionStorage.getItem('INIT_URL') || localStorage.getItem('INIT_URL');
      // console.log( !isEmpty( sessionStorage.getItem('INIT_URL') ), typeof sessionStorage.getItem('INIT_URL') )
      if( !isEmpty( storage ) ) {
        astate = this.readStorage( JSON.parse( storage || '' ) );
        this.cacheApi.getToken().then( (t: any) => {console.log('GETTOKEN FROM CACHE', this.readStorage(JSON.parse(t)) )} );
      }

      // console.log('can add reservation');

      if(!astate.t && !astate.id) {
        this.router.navigate(['/','login']);
        return false;
      }

      return true;
      // ?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&id=3OBBz2VXVSi109vsQLLGbXbp3222yi4E7lw9fKSYo1c%3d
      // https://hc-test-weu-app-concierge-01.azurewebsites.net/?h=1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d&t=%2bRGs4Dny7H8%2bsx0x7AaXKC8PQR37EY6sWDb%2fnCNgeVY%3d
  //     if(location.search) {
  //       console.log(location.search , route.queryParams);

  //       if( !isEmpty(route.queryParams) ) {
  //         //keys h Id
  //         if( route.queryParamMap.has('h') ) {
  //           this.authService.setHotelId( route.queryParamMap.get('h') || '' );
  //         }
  //         if( route.queryParamMap.has('id') || route.queryParamMap.has('Id')  ) {
  //           this.authService.setAccessKey('id')
  //           this.authService.setReservationId( route.queryParamMap.get('id') || route.queryParamMap.get('Id') || '')
  //         }
  //         if( route.queryParamMap.has('t') ) {
  //           this.authService.setAccessKey('stayid')
  //           this.authService.setReservationId(route.queryParamMap.get('t') || '')
  //         }
  //         if( ! route.queryParamMap.has('t') && ! route.queryParamMap.has('id') && ! route.queryParamMap.has('Id') ) {
  //           sessionStorage.removeItem('LOGGEDIN');
  //         }
  //       }
  //     }
  //     if( ! this.authService.isAuthenticated() ) {
  //       console.log('AuthGuard: User is not authenticated');
  //       if(isEmpty(route.queryParams)){
  //         console.log('AuthGuard: User is not no params');
  //         this.authService.retriveInfos();
  //       }
  //       // 1GY9G4nFnYYn0r9jUhF%2bTg%3d%3d %2fy6zRs0AG1j1NHwa4Kvs16MnlKIS8nGuMs85nrnFBl0%3d
  //       if(!isEmpty(route.queryParams) ){
  //         console.log('b')
  //         const result = this.authService.parseToken(route.queryParamMap);

  //         this.authService.setInitialUrl(route.queryParams);
  //         // this.authService.setToken(result);
          
  //         if(result.length >= 2) {
  //           console.log('LOGGEDIN true');
  //           sessionStorage.setItem('LOGGEDIN',"true");
  //           this.router.navigate(['/','app']);
  //           return true;
  //         }else{
  //           console.log('LOGGEDIN false');
  //           sessionStorage.setItem('LOGGEDIN',"false");
  //           this.router.navigate(['/','login']);
  //           return true;
  //         }
  //       }else{
  //         console.log('c')
  //         console.log(route.queryParams);
  //         this.router.navigate(['/','expired']);
  //         return false;
  //       }
        
  //       return true;
  //     }
  //     console.log('d')
  //     if(state.url !== '/app'){
  //       this.router.navigate(['/','app']);
  //     }

  //     // queryParams: {token: '2000', user: '4000'}
  //   return true;
  }
  
}
