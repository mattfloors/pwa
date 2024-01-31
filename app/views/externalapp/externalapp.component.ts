import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { GetUserCheckInCheckOut } from '../../store/ui/selectors';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SetCurrentPage } from '../../store/ui/actions';


@Component({
  selector: 'app-external',
  template: `
  
  <iframe #iframe *ngIf="(Url$ | async) as url"
    [src]="url"
    style="
      border: 0;
      width: 100%;
      height: calc(100vh - 125px);
    "
  ></iframe>`
})
export class ExternalAppComponent implements OnInit, AfterViewInit {
  public Url$!: Observable<SafeUrl>
  @ViewChild('iframe') iframeComponent!: ElementRef<HTMLIFrameElement>;
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private domSanitizer: DomSanitizer) { 
    this.store.dispatch( SetCurrentPage({payload: this.route.snapshot.data['key']}) );
  }

  ngOnInit(): void {
    
    this.Url$ = this.store.pipe( select(GetUserCheckInCheckOut) ).pipe(
      filter( r => !!(r) ),
      map( (r: any) => r && r[this.route.snapshot.data['key']] ),
      tap( console.log ),
      map( r => this.domSanitizer.bypassSecurityTrustResourceUrl(r) )
    )
  }

  ngAfterViewInit(): void {
    if( this.iframeComponent ) {
      console.log(this.iframeComponent);
    }
  }

}
