import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, merge, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { IMessages } from '../../models/messages.model';
import { FetchService } from '../../services/fetch.service';
import { StoreService } from '../../services/store.service';
import { AppState } from '../../store';
import { GetAreaSuccess, GetUnits, GetUnitsSuccess } from '../../store/messages/actions';
import { GetAreas } from '../../store/messages/selectors';
import { SetCurrentPage } from '../../store/ui/actions';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit, OnDestroy {

  // private messages$: BehaviorSubject<IMessages[]> = new BehaviorSubject(this.messages);
  // this.messages$.asObservable();
  public Messages$!: Observable<IMessages[]>; 
  public Units$!: Observable<any[]>;
  public readonly Colors: string[] = ["#227c9d","#17c3b2","#ffcb77","#fef9ef","#fe6d73"];
  hidden = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();


  constructor( private store: Store<AppState>, private translateService: TranslateService, private router: ActivatedRoute) { 
    this.store.dispatch( SetCurrentPage({payload: 'messages'}) );
  }

  ngOnInit(): void {

    this.Units$ = merge(
      this.router.data.pipe( map( r => r['Data'] ) ), 
      this.store.pipe( select( GetAreas ) ) 
    );

    this.translateService.onLangChange.pipe(
      tap( r => this.store.dispatch( GetUnits() ) ),
      takeUntil(this.destroy$)
    ).subscribe()

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
