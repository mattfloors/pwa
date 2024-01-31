import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { map, tap } from 'rxjs';
import { FetchService } from '../../services/fetch.service';
import { StoreService } from '../../services/store.service';
import { AppState } from '../../store';
import { GetUnits } from '../../store/messages/actions';
import { GetMeteo, GetMeteoSuccess, SetCurrentPage } from '../../store/ui/actions';
import { GetLanguage } from '../../store/ui/selectors';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit, OnDestroy {
  public Meteo$!: Observable<any[]>;
  public Lang: string = 'en-US';
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private actions: Actions,
    private store: Store<AppState>, 
    private storeService: StoreService, 
    private translateService: TranslateService
  ) {
    this.store.dispatch( GetMeteo() );
    this.store.dispatch( SetCurrentPage({payload: 'meteo'}) );
  } 

  ngOnInit(): void {

    this.store.dispatch( GetUnits() );

    this.Meteo$ = this.actions.pipe(
      ofType( GetMeteoSuccess ),
      map( ({payload}) => payload )
    )

    this.store.pipe( select( GetLanguage ), map( l => l || 'en-US'), 
      tap( i => this.Lang = i ),
      takeUntil(this.destroy$)
    ).subscribe()
    
    // this.api.getMeteo('torino');
    this.translateService.onLangChange.pipe(
      tap( () => this.store.dispatch( GetMeteo() ) ),
      takeUntil(this.destroy$)
    ).subscribe()

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
