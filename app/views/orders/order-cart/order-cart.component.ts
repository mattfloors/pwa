import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOrderItem } from '../../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-menus',
  template: `
    <div style="overflow-y: auto">
      <table style="
        table-layout: fixed;
        width: 100%;
      ">
        <tr *ngFor="let item of Items | groupBy : 'Codice' ">
          <td>
            <ng-container *ngIf="item[1].length > 1">{{item[1].length}} X</ng-container> 
            {{item[1][0]?.Descrizione | titlecase}}
            <ng-container *ngFor="let note of getNote(item[1])">
              <div>- {{note}} </div>
            </ng-container>
          </td>
          <td style="text-align: right">
            {{calcPrice(item[1]) | currency}}
          </td>
        </tr>
      </table>
    </div>
    <table style="
      table-layout: fixed;
      width: 100%;
    ">
      <tr *ngIf="Increase">
        <td style="border-top: 1px solid">{{'TOTAL_PARTIAL' | translate}}</td>
        <td style="border-top: 1px solid; text-align: right">{{Total | currency }}</td>
      </tr>
      <tr *ngIf="Increase">
        <td>{{'TOTAL_INCREASE' | translate}}</td>
        <td style="text-align: right">{{Increase | currency }}</td>
      </tr>
      <tr>
        <td><strong>{{'TOTAL_PAYAMOUNT' | translate}}</strong></td>
        <td style="text-align: right"><strong>{{FullTotal | currency }}</strong></td>
      </tr>
    </table>
    <div>
      <button mat-raised-button (click)="Dismiss.emit()">{{ 'BUTTONS.DISMISS' | translate }}</button>
      <button mat-raised-button (click)="Confirm.emit()" color='primary'>{{ 'BUTTONS.CONFIRM' | translate }}</button>
    </div>
  `,
  styles: [`\:host td{
    padding: 0.5rem
  }`]
})
export class OrderCartComponent implements OnInit {
  @Input() Items!: IOrderItem[];
  @Input() Total!: number;
  @Input() Increase!: number;
  @Output() Confirm = new EventEmitter();
  @Output() Change = new EventEmitter();
  @Output() Dismiss = new EventEmitter();
  public FullTotal: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.FullTotal = this.Total + this.Increase;
  }

  calcPrice( items: IOrderItem[] ) {
    return items.reduce( (acc, item) => (acc += item.Prezzo || 0), 0 );
  }

  getNote( items: IOrderItem[] ) {
    return items.reduce( (acc: string[], item) => {
      if(item.Note){
        return ([...acc, item.Note]);
      }
      return acc;
    }, [] );
  }

}
