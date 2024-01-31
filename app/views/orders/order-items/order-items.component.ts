import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOrderItem, IOrderMenu } from '../../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-item',
  template: `
    <ng-content></ng-content>
    <span *ngIf="Space" class="hc-line-spacer"></span>
    <span class="hc-display-flex" *ngIf="!hideCommand">
      <button *ngIf="(Item?.Qta || 0) > 0" [disabled]="disabled" mat-icon-button (click)="Change.emit(-1)"><mat-icon>remove</mat-icon></button>
      <span *ngIf="(Item?.Qta || 0) > 0" class="hc-qta">{{Item?.Qta}}</span>
      <button [disabled]="disabled" mat-icon-button (click)="Change.emit(1)"><mat-icon>add</mat-icon></button>
    </span>
    <span class="hc-display-flex" *ngIf="hideCommand">
      <button [disabled]="disabled" mat-icon-button (click)="Delete.emit()"><mat-icon>delete</mat-icon></button>
    </span>
  `,
  styles: [ `
    \:host{
      display: flex;
      align-items: center;
      width: 100%;
    }

    .hc-qta {
      width: 3rem;
      /* text-align: center; */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }

    `
  ]
})
export class OrderItemComponent implements OnInit {
  @Input() HasPrice!: boolean;
  @Input() hideCommand!: boolean;
  @Input() disabled!: boolean;
  @Input() Notes!: boolean;
  @Input() Space :boolean = true;
  @Input() Item!: IOrderItem | IOrderMenu;
  @Output() Change = new EventEmitter();
  @Output() Delete = new EventEmitter();

  private isMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.isMenu === this.Item.hasOwnProperty('Articles');
  }

}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-menu',
  template: `
    <div>
      <button mat-button (click)="Opened = !Opened">
        <mat-icon *ngIf="Opened">expand_less</mat-icon>
        <mat-icon *ngIf="!Opened">expand_more</mat-icon>
      </button>
      <ng-content></ng-content>
      <span class="hc-line-spacer"></span>
      <span class="hc-display-flex" *ngIf="!hideCommand">
        <button *ngIf="(Item?.Qta || 0) > 0" [disabled]="disabled" mat-icon-button (click)="Change.emit(-1)"><mat-icon>remove</mat-icon></button>
        <span *ngIf="(Item?.Qta || 0) > 0" class="hc-qta">{{Item?.Qta}}</span>
        <button [disabled]="disabled" mat-icon-button (click)="Change.emit(1)"><mat-icon>add</mat-icon></button>
      </span>
      <span class="hc-display-flex" *ngIf="hideCommand">
        <button [disabled]="disabled" mat-icon-button (click)="Delete.emit()"><mat-icon>delete</mat-icon></button>
      </span>
    </div>
    <div *ngIf="Opened" class="hc-indented">
      <div *ngFor="let subItem of Item.Articles; index as i">
        <button *ngIf="hasNote" mat-button (click)="onNote(subItem, i)">
          <mat-icon *ngIf="!subItem?.Note">chat_bubble_outline</mat-icon>
          <mat-icon *ngIf="subItem?.Note">chat</mat-icon>
        </button>
        {{subItem?.Descrizione | titlecase}}
        <span class="hc-line-spacer"></span>
      </div>
    </div>

  `,
  styles: [ `
    \:host > div{
      display: flex;
      align-items: center;
      width: 100%;
    }

    .hc-qta {
      width: 3rem;
      /* text-align: center; */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }

    `
  ]
})

export class OrderMenuComponent extends OrderItemComponent implements OnInit {
  public Opened: boolean = false;
  @Input() hasNote: boolean | null = true;
  @Output() Note = new EventEmitter();

  constructor() {
    super();
  }

  public onNote(item: any, index: number) {
    console.log('onNote', item);
    this.Note.emit(item);
  }
}