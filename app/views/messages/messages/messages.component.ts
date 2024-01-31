import { Component, Input,EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMessages } from '../../../models/messages.model';
import { AppState } from '../../../store';
import { OpenedMessages, SendMessage, SetArea, SetMessages } from '../../../store/messages/actions';
import { GetArea, GetCurrentArea, GetMessages } from '../../../store/messages/selectors';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewInit {
  @Input() Data: IMessages[] = [];
  @Input() UnitsLength = 1;
  @Output() Submit = new EventEmitter<any>;
  @ViewChild('ScrollerInner') Container!: ElementRef<HTMLDivElement>;
  public Messages$!: Observable<any[]>;
  public Area$: Observable<any> = this.store.pipe( select(GetCurrentArea) );

  public Form: FormGroup = this.fb.group({
    message: this.fb.control('')
  });
  public onSendMessage() {
    console.log(this.Form.value.message);
    // this.Submit.emit(this.Form.value);
    this.store.dispatch( SendMessage( { payload: {
      From: 'GUEST',
      MessageText: this.Form.value.message,
      MessageDateTime: new Date().toISOString().toString(),
      NewMessage: true
    } }) );
    this.Form.reset();
    this.updateScrollPosition();
  }
  
  constructor(private fb: FormBuilder, private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.Messages$ = this.store.pipe( select(GetMessages) ).pipe(
      tap( () => setTimeout( () => this.updateScrollPosition(), 125 ) ),
    );
    this.store.dispatch( SetArea({payload: this.route.snapshot.params['id']}) );
    this.store.dispatch( OpenedMessages({payload: []}) )
  }

  ngAfterViewInit(): void {
    this.updateScrollPosition()
  }


  updateScrollPosition() {
    if(this.Container){
      const itemToScroll = this.Container.nativeElement.children[0];
      if(itemToScroll){
        this.Container.nativeElement.scrollTop = this.Container.nativeElement.scrollHeight;
      }
    }
  }


}
