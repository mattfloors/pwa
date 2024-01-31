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

@Injectable()
export class PostInterceptor implements HttpInterceptor {
  

  constructor() {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.method === 'POST'){
      request = request.clone({
        setHeaders: {'Content-Type': 'application/json'}
      });
    }
    return next.handle(request)
  }
}
