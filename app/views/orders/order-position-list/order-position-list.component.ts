import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, merge, Subject } from "rxjs";
import { tap, map, takeUntil } from "rxjs/operators";
import { IRoomPositions } from "../../../models/order.model";
import { StoreService } from "../../../services/store.service";
import { QRCodeComponent } from "../../../shared/qr-code-reader/qr-code-reader.component";
import { AppState } from "../../../store";
import { GetUnits } from "../../../store/messages/actions";
import { CheckQRCodeArea, GetPositionsContent, SetPositionInfo, SetTableCode } from "../../../store/orders/actions";
import { CanUseQRCode } from "../../../store/ui/selectors";


@Component({
  selector: 'app-order-list',
  template: `
    <div 
      *ngIf="(AreaPositions$ | async) as Positions;"
      class="content" fxLayout="row wrap">

      <ng-content *ngIf="Positions?.servicePositions?.length !== 0; then list; else empty"></ng-content>
      <ng-template #empty>
        <div fxLayout="column" class="hc-center-image">
          <figure class="is-responsive">
            <img src="../assets/placeholders/066-storefront-monochrome.svg">
          </figure>
          <h2>{{'MESSAGES.EMPTY_POSITIONS' | translate}}</h2>
        </div>
      </ng-template>
      <ng-template #list>
        <ng-container *ngFor="let pos of Positions?.servicePositions">
          <a 
            class="hc-no-link-appearance"
            (click)="onClick(pos)"
            [routerLink]="['..', pos.code, Positions?.resourceCode]"
            fxFlex.xs="50" fxFlex="33.333" style="padding: 8px">
            <mat-card>
              {{pos.description}}
            </mat-card>
          </a>
        </ng-container>
      </ng-template>

      <app-page-actions *ngIf="CanUseQRCode$ | async">
        <button type="button" class="toolbar-btn" mat-icon-button (click)="onQRCode()">
          <mat-icon>qr_code</mat-icon>
        </button>
      </app-page-actions>
    </div>

  `
})
export class OrderPositionListComponent implements OnInit, OnDestroy {
  public CanUseQRCode$!: Observable<boolean | null>;
  public AreaPositions$!: Observable<IRoomPositions>;
  private destroy$: Subject<boolean> = new Subject<boolean>()
  
  public onQRCode(){
    const dialogRef = this.dialog.open(QRCodeComponent);
    dialogRef.componentInstance.onSuccessEvent.subscribe( (data: string) => {
      this.store.dispatch( CheckQRCodeArea({payload: data}) )
      dialogRef.close();
    })
  }
  
  public onClick(event: any) {
    this.store.dispatch( SetPositionInfo( {payload: event} ) );
    this.store.dispatch( SetTableCode( {payload: event.tableCode} ) );
  }

  constructor(
    private actions: Actions,
    public store: Store<AppState>, 
    private storeService: StoreService, 
    private translateService: TranslateService,
    public dialog: MatDialog, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.store.dispatch( GetUnits() );
    this.AreaPositions$ = merge( 
      this.route.data.pipe( map(r => r["Data"]) ),
      this.actions.pipe( ofType(), map( ({payload}) => payload) ) 
    );
    this.CanUseQRCode$ = this.store.pipe( select( CanUseQRCode ) );
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe( () => this.store.dispatch( GetPositionsContent({payload: this.route.snapshot.params['position']}) ) )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}