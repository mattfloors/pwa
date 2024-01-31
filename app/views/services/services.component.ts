import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, takeUntil, filter, tap } from 'rxjs/operators';
import { IPages } from '../../models/reservation.model';
import { IService } from '../../models/service.model';
import { StoreService } from '../../services/store.service';
import { AppState } from '../../store';
import { GetUnits } from '../../store/messages/actions';
import { GetService, GetServices, GetServicesSuccess, SetCurrentPage } from '../../store/ui/actions';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  public Service$!: Observable<IPages[]>;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private actions: Actions,
    private store: Store<AppState>, 
    private translateService: TranslateService, 
    private storeService: StoreService, 
    private route: ActivatedRoute
  ) { 
    this.store.dispatch( SetCurrentPage({payload: 'services'}) );
  }

  ngOnInit(): void {

    this.store.dispatch( GetUnits() );

    this.Service$ = merge(
      this.route.data.pipe( 
        map( r => r['service'] || [] ) 
      ),
      this.actions.pipe( ofType( GetServicesSuccess ),
        filter( ({payload}) => !!(payload) ),
        map( ({payload}) => payload )
      ) 
    )

    this.translateService.onLangChange.pipe(
      tap( r => this.store.dispatch( GetServices() ) ),
      takeUntil(this.destroy$)
    ).subscribe()
    
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete()
  }

}
