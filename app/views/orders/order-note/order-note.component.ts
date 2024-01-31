import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrderItem } from '../../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-note',
  template: `
    <form [formGroup]="Form" class="hc-column-form" (ngSubmit)="this.onSave()">
      <mat-form-field form class="example-full-width" appearance="fill">
        <mat-label>{{'LEAVE_NOTE' | translate}}</mat-label>
        <textarea formControlName="Note" #textarea matInput placeholder="{{'FOOD_NOTE' | translate}}"></textarea>
        <mat-hint>{{textarea?.value?.length}} / {{MaxLength}} {{'CHARS' | translate}}</mat-hint>
      </mat-form-field>
      <button [disabled]="!Form.valid" mat-raised-button>{{'BUTTONS.SAVE' | translate}}</button>
    </form>
  `,
  styles: [`
    .hc-column-form{
      display: flex;
      flex-direction: column;
    }
  `]
})
export class OrderNoteComponent implements OnInit {
  @Input() Item!: IOrderItem;
  @Input() Note!: string[];
  @Output() Save = new EventEmitter();
  public MaxLength = 60;
  public Form: FormGroup = this.fb.group({Note: this.fb.control('', Validators.maxLength(60) )});
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.Form.patchValue({Note: this.Item.Note});
  }

  onSave(){
    this.Save.emit({...this.Item, Note: this.Form.value.Note});
  }

}
