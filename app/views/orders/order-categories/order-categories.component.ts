import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { IApplicationState } from "../../../models/reservation.model";
import * as fromActions from './../../../store/orders/actions';

@Component({
  selector: 'app-order-categories',
  template: `
    <div class="content" fxLayout="row wrap">
      <div fxFlex.xs="50" fxFlex="33" style="padding: 8px" *ngFor="let category of Categories; trackBy:categoryCode">
        <mat-card [ngClass]="{'hc-selected': category?.Selected}" (click)="Toggle.emit(category?.Codice)">
          {{category?.Descrizione | titlecase}}
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `\:host{
      position: absolute;
      z-index: 1;
      background: white;
      width: 100%;
      height: calc(100% - 56px);
    }`
  ]
})
export class OrderCategoriesComponent implements OnInit {
  @Input() Categories: any[] = [];
  @Output() Toggle: EventEmitter<string> = new EventEmitter();
  ngOnInit() {
    this.store.dispatch( fromActions.GetCategories() );
  }
  categoryCode(category: any) {
    return category.Codice;
  }
  constructor(private store: Store<IApplicationState>) {}
}
