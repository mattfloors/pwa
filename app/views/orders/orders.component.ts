import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap, takeUntil, switchMap, withLatestFrom } from 'rxjs/operators';
import { IRoom } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { FetchService } from '../../services/fetch.service';
import { UiService } from '../../services/ui.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { QRCodeComponent } from '../../shared/qr-code-reader/qr-code-reader.component';
import { AppState } from '../../store';
import { GetUnits } from '../../store/messages/actions';
import { CheckQRCodeArea, GetPositions, GetPositionsSuccess } from '../../store/orders/actions';
import { SetCurrentPage } from '../../store/ui/actions';
import { CanUseQRCode, GetReservationInfos } from '../../store/ui/selectors';

// tableCode
// elimianre spazio bianco

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, OnDestroy {
  public Areas$!: Observable<IRoom[]>;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private api: FetchService, 
    public store: Store<AppState>, 
    private actions: Actions, 
    private translateService: TranslateService,
    private uiService: UiService, 
    public dialog: MatDialog
  ) { 
    this.store.dispatch( SetCurrentPage({payload: 'orders'}) );
  }
  public CanUseQRCode$!: Observable<boolean | null>;

  public onQRCode(){
    // this.api.getQRCode().subscribe(console.log)
    const dialogRef = this.dialog.open(QRCodeComponent);

    dialogRef.componentInstance.onSuccessEvent
    .subscribe( (data: string) => {
      this.store.dispatch( CheckQRCodeArea({payload: data}) )
      dialogRef.close();
    })
  }

  ngOnInit(): void {

    this.store.dispatch( GetUnits() );

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe( () => this.store.dispatch( GetPositions() ) )

    this.Areas$ = merge(
      of(true).pipe(
        withLatestFrom(this.store.pipe( select(GetReservationInfos) )),
        switchMap( ([_, reservation]) => this.api.getAreas(reservation?.stayId || -1 ,this.uiService.getLanguage()) )
      ),
      this.actions.pipe(ofType(GetPositionsSuccess), map( ({payload}) => payload ))
    ).pipe(
      map( (rooms: IRoom[]) => rooms.map( (r: IRoom) => {
        const exist = r.openingTime.find( (a, i) => {
          const parseStart = Number(a.fromHour.split(':').join(''));
          const parseEnd = Number(a.toHour.split(':').join(''));
          return this.uiService.isOpen(a.iddayOfWeek, [parseStart, parseEnd]) }
        );
        return ({...r, activable: !!exist});
      }),
      catchError( e => {
        this.dialog.open( DialogComponent, {data: {title: '', text: e.error} } );
        return of([]) 
      })
    ));

    this.CanUseQRCode$ = this.store.pipe( select( CanUseQRCode ) );
 
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  
}
