


import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ESurveyType, ISurvey, SurveyResult } from '../../models/survey.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';
import * as fromSelector from '../../store/survey/selectors';
import { GetSurvey, GetSurveyFail, SetSurvey, SetSurveySuccess } from '../../store/survey/actions';
import { AppState } from '../../store';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofType } from '@ngrx/effects';

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SetCurrentPage } from '../../store/ui/actions';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {
  private done = false;
  private limitQuestions: number = 0;
  public CanSend: boolean = false;
  public Questions: ISurvey[] = [];
  public Questions$: Observable<ISurvey[]> = this.store.pipe( select( fromSelector.GetQuestions ) );
  public Loading$: Observable<boolean> = this.store.pipe( select( fromSelector.GetSurveyLoading ));
  public Loaded$: Observable<boolean> = this.store.pipe( select( fromSelector.GetSurveyLoaded ));
  public SurveyDone$!: Observable<string>;
  private destroy$: Subject<boolean> = new Subject<boolean>()

  onValueChange(event: any, index: number) {
    this.Questions = this.Questions.map( (v, i) => i === index ? { ...v, value: event } : v );
    this.CanSend = !!(this.limitQuestions === this.Questions.filter( ({type, value}) => type !== ESurveyType.TEXTAREA && value !== -1).length);
  }

  onSetComment(event: any, index: number) {
    this.Questions = this.Questions.map( (v, i) => i === index ? { ...v, comments: event } : v );
  }

  onSend(){
    if(!this.done ){  
      const payload = this.Questions.map( q => new SurveyResult(q) );
      this.store.dispatch( SetSurvey({payload: payload}) )
    }else{
      this.setDialog(this.translateService.instant('MESSAGES.SURVEY_SENDED'))
    }

  }

  private setDialog(text: string) {
    return this.dialog.open( DialogComponent, { data: {text: text, title: '' } } );
  }

  constructor(
    public dialog: MatDialog,
    private actions: Actions,
    private store: Store<AppState>,
    private translateService: TranslateService
  ) { 
    this.store.dispatch( SetCurrentPage({payload: 'survey'}) );
  }

  ngOnInit(): void {
    
    this.store.dispatch( GetSurvey() );
    this.Questions$.pipe(
      tap( (r) => {
        this.limitQuestions = r.filter( ({type}) => type !== ESurveyType.TEXTAREA ).length;
        console.log(this.limitQuestions)
      })
    ).subscribe( r => { this.Questions = r } )

    this.translateService.onLangChange.pipe(
      tap( () => this.store.dispatch( GetSurvey() ) ),
      takeUntil(this.destroy$)
    ).subscribe()

    this.actions.pipe(
      ofType( SetSurveySuccess ),
      map( ({result}) => result )
    ).subscribe( (res) => {
      console.log('SetSurveySuccess', res);
      if(typeof res === 'boolean') {
        this.done = true;
        this.setDialog( this.translateService.instant('MESSAGES.SURVEY_SEND') ) 
      }
    })

    this.SurveyDone$ = this.actions.pipe(
      ofType( GetSurveyFail ),
      map( ({payload}) => this.translateService.instant(payload)
      )
    )

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
