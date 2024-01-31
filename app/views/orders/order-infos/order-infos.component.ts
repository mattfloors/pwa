import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-order-info',
  template: `
    <mat-list role="menu">
      <mat-list-item *ngFor="let item of data">
        {{item?.Descrizione | titlecase}}
      </mat-list-item>
    </mat-list>
  `
})
export class OrderInfosComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) {}
}