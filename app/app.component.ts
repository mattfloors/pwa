import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from './services/ui.service';
import { AppState } from './store';
import { UnSubscribeToken } from './store/ui/actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy{
  private style!: HTMLElement;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private store: Store<AppState>,
    private uiService: UiService
  ) {

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('display-mode is standalone', 'app installed', 'again');
      localStorage.setItem('MESSAGE_SESSION_TOKEN_INSTALLED', 'true');
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      if( localStorage.getItem('MESSAGE_SESSION_TOKEN') && localStorage.getItem('MESSAGE_SESSION_TOKEN_INSTALLED') ) {
        console.log('app uninstalled', e);
        this.store.dispatch( UnSubscribeToken({payload: {SubscriptionToken: localStorage.getItem('MESSAGE_SESSION_TOKEN') || '' }}) ); 
      }
    })

    window.addEventListener('appinstalled', (evt) => {
      console.log('app installed', evt);
      localStorage.setItem('MESSAGE_SESSION_TOKEN_INSTALLED', 'true');
    });
  }

  ngOnInit(): void {
    this.uiService.isOnline().pipe(takeUntil(this.destroy$)).subscribe();
    this.uiService.Color$.pipe(takeUntil(this.destroy$)).subscribe( c => {
      if(this.style) {
        this.style.parentNode?.removeChild(this.style)
      }
      this.style = document.createElement("style")
      this.style.textContent = c;
      this.document.head.appendChild(this.style);
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
