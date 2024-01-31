import { Constructor } from "@angular/cdk/table";
import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { StoreService } from "../../services/store.service";
import { AppState } from "../../store";
import { UserLogin } from "../../store/ui/actions";
import { GetLoggedError } from "../../store/ui/selectors";

@Component({
  selector: 'app-login-page',
  template: `
    <mat-card>
      <app-login (Submit)="onSubmit($event)"></app-login>
      <div class="hc-message-error hc-display-flex" *ngIf="(Error$ | async) as errorMessage">
        <mat-icon>notification_important</mat-icon>
        {{errorMessage}}
      </div>
    </mat-card>
  `
})

export class LoginPageComponent implements OnInit {
  public Error$: Observable<string> = this.store.pipe( select(GetLoggedError) )
  constructor(private store: Store<AppState>, private storeService: StoreService) {}
  ngOnInit() {}
  onSubmit(event: any) {
    this.store.dispatch( UserLogin(event) );
  }
}
