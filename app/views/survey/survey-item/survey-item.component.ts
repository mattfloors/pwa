




import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISurvey } from '../../../models/survey.model';

@Component({
  selector: 'app-survey-item',
  template: `
    <ng-content></ng-content>
    <div class="hc-display-flex hc-space-between">
      <ng-container [ngSwitch]="Question?.type">
        <ng-container *ngSwitchCase="5">
          <button mat-button [color]="(Question?.value == 1 ? 'accent' : '')" (click)="ValueChange.emit(1)">
            <mat-icon>mood_bad</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 2 ? 'accent' : '')" (click)="ValueChange.emit(2)">
            <mat-icon >sentiment_dissatisfied</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 3 ? 'accent' : '')" (click)="ValueChange.emit(3)">
            <mat-icon >sentiment_neutral</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 4 ? 'accent' : '')" (click)="ValueChange.emit(4)">
            <mat-icon >sentiment_satisfied</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 5 ? 'accent' : '')" (click)="ValueChange.emit(5)">
            <mat-icon>mood</mat-icon>
          </button>
        
        </ng-container>
        <ng-container *ngSwitchCase="3">
          <button mat-button [color]="(Question?.value == 1 ? 'accent' : '')" (click)="ValueChange.emit(1)">
            <mat-icon>mood_bad</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 2 ? 'accent' : '')" (click)="ValueChange.emit(2)">
            <mat-icon>sentiment_neutral</mat-icon>
          </button>
          <button mat-button [color]="(Question?.value == 3 ? 'accent' : '')" (click)="ValueChange.emit(3)">
            <mat-icon>mood</mat-icon>
          </button>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <mat-form-field form class="hc-full-width" appearance="fill">
            <mat-label>{{'LEAVE_NOTE' | translate}}</mat-label>
            <textarea #textarea matInput (blur)="onValueChange(textarea.value)" [value]="(Question?.value !== -1 ? (Question?.value || '') : '')"></textarea>
            <!--<mat-hint>{{textarea?.value?.length}} / {{MaxLength}} chars</mat-hint>-->
          </mat-form-field>
        </ng-container>
      
      
      </ng-container>
    </div>
    <ng-container *ngIf="Question?.additionalComments">
      <mat-form-field form class="hc-full-width" appearance="fill">
        <mat-label>{{'LEAVE_NOTE' | translate}}</mat-label>
        <textarea #textarea matInput (blur)="onSetComment(textarea.value)" [value]="Question?.comments || ''"></textarea>
        <!--<mat-hint>{{textarea?.value?.length}} / {{MaxLength}} chars</mat-hint>-->
      </mat-form-field>
    </ng-container>
  `
})
export class SurveyItemComponent implements OnInit {
  @Input() public Question!: ISurvey;
  @Output() public ValueChange = new EventEmitter<any>();
  @Output() public CommentChange = new EventEmitter<any>();

  MaxLength = 60;

  constructor() { }

  ngOnInit(): void {
  }

  onValueChange(event: string){
    this.ValueChange.emit((event as string).trim());
  }

  onSetComment(event: string) {
    this.CommentChange.emit((event as string).trim());
  }

}
