import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { IService, IServiceContent } from '../../../models/service.model';
import { StoreService } from '../../../services/store.service';
import { AppState } from '../../../store';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { GetService, GetServiceSuccess, SetCurrentPage } from '../../../store/ui/actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy {
  @Input() Service$!: Observable<IServiceContent>;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private actions: Actions,
    private route: ActivatedRoute, 
    private store: Store<AppState>, 
    private translateService: TranslateService, 
    private storeService: StoreService
  ) { 
    this.store.dispatch( SetCurrentPage({payload: 'services'}) );
  }

  ngOnInit(): void {
    this.Service$ = merge(
      this.route.data.pipe( 
        map( r => r['service'] as IServiceContent || [] )
      ),
      this.actions.pipe( ofType( GetServiceSuccess ),
        filter( ({payload}) => !!(payload) ),
        map( ({payload}) => payload )
      ) 
    )

    this.translateService.onLangChange.pipe(
      tap( r => this.store.dispatch( GetService({payload: this.route.snapshot.params['id']}) ) ),
      takeUntil(this.destroy$)
    ).subscribe()

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete()
  }

}
