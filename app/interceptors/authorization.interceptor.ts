import { Injectable, isDevMode } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, finalize, switchMap, take, map, tap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private AUTH_HEADER = "Authorization";
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // Access-Control-Allow-Origin: *

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addAuthenticationToken(request);
    return next.handle(request).pipe(
      catchError(error => {

          if (error && error.status === 400) {
            if( error.error ==='INVALID_RESERVATION_CANCELLED') {
              this.router.navigate(['error'], { state: {message: error.error} })
            }
          }


          if (error && error.status === 401) {
            // 401 errors are most likely going to be because we have an expired token that we need to refresh.
            if (error.error) {

              isDevMode() && console.log(error, error.error);
              if( error.error.toUpperCase() === 'INVALID_RESERVATION_NOTFOUND - CONCIERGE_SETTINGS') {
                // console.log('INVALID_RESERVATION_NOTFOUND');
                this.router.navigate(['error'], { state: {message: error.error} })
              }
              if( error.error === 'EMAIL_VERIFY: "Impossibile ottenere la configurazione hotel"' ) {
                this.router.navigate(['error'], { state: {message: error.error} })
              }
              
              if( error.error ==='INVALID_RESERVATION_CANCELLED - RESERVATION_VALIDITY') {
                this.router.navigate(['error'], { state: {message: error.error} })
              }
              if( error.error === 'INVALID_RESERVATION_EXPIRED - RESERVATION_VALIDITY') {
                this.router.navigate(['error'], { state: {message: error.error} })
              }
              // if( error.error === 'INVALID_RESERVATION_NOTFOUND - RESERVATION_VALIDITY') {
              
              if( error.error === 'INVALID_RESERVATION_NOTFOUND - RESERVATION_VALIDITY') {
                this.router.navigate(['error'], { state: {message: error.error} })
              }

            }

            // console.log('1');
            if (this.refreshTokenInProgress) {
              // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
              // which means the new token is ready and we can retry the request again
              // console.log('3');
              return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.addAuthenticationToken(request)))
              );
            } else {

              // console.log('2');
              this.refreshTokenInProgress = true;

              // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
              this.refreshTokenSubject.next(null);
              
              return this.refreshAccessToken().pipe(
                switchMap((success) => {
                  // console.log('5');
                  this.refreshTokenSubject.next(!!success);
                  return next.handle(this.addAuthenticationToken(request));
                }),
                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                finalize(() => this.refreshTokenInProgress = false)
              );
            }
          } else {
            return throwError(error);
          }
        }
          
      ))
  }

  private refreshAccessToken(): Observable<string> {
    return this.auth.requestToken();
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    
    if (!this.auth.getToken()) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    // if (!request.url.match(/www.mydomain.com\//)) {
    //   return request;
    // }
    if(isDevMode()) {
      console.log('addAuthenticationToken');
    }
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.auth.getToken())
    });
  }
}
