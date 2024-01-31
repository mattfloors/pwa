
import { Component, Input, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../store';

@Component({
  selector: 'app-error-page',
  template: `
    <div class="hc-display-flex hc-flex-column hc-flex-align-center">
      <figure class="is-responsive is-centered">
        <img src="../assets/icons/icon-144x144.png">
      </figure>
      <h2 class="mat-h2" style="margin: 0 0 1.5rem 0">
        Digital Concierge
      </h2>
      <p>
        {{ (ErrorMessage$ | async)?.message }}
      </p>
    </div>
  `
})
export class ErrorComponent implements OnInit {
  public ErrorMessage$!: Observable<{message: string}>;
  private navigation: Navigation | null;
  constructor(private router: Router) { 
    this.navigation = this.router.getCurrentNavigation();
    console.log(this.navigation, this.navigation?.extras.state);
  }

  ngOnInit(): void {
    this.ErrorMessage$ = of( this.navigation?.extras.state as {message: string} || {message: 'Not Found'} )
  }

}
