import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { IReservation, ISettings } from '../../models/reservation.model';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { UiService } from '../../services/ui.service';
import { AppState } from '../../store';
import { GetUnits } from '../../store/messages/actions';
import { SetCurrentPage } from '../../store/ui/actions';
import { GetGreetings, GetLanguage, GetReservationInfos } from '../../store/ui/selectors';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public Reservation$: Observable<IReservation | null> = this.store.pipe( select( GetReservationInfos ) );
  public Settings$: Observable<ISettings> = this.uiService.Settings$;
  public Language$: Observable<string> = this.store.pipe( select( GetLanguage ) );
  public Greetings$ = this.store.pipe( select( GetGreetings ) );
  // public Greetings$ = combineLatest([this.uiService.Settings$, this.Language$]).pipe(
  //   tap(console.log),
  //   map(([e, b]: [ISettings, string]) => e.welcomeMessages.translations.find( ({lang}: any) => lang.toLowerCase() === e.languagesList.find( ({isDefaultLanguage}: any) => isDefaultLanguage )?.code.toLowerCase() ) ),
  //   tap(console.log),
  // );


  constructor(
    private store: Store<AppState>, 
    private auth: AuthService, 
    private storeService: StoreService, 
    private uiService: UiService) { 
      this.store.dispatch( SetCurrentPage({payload: 'welcome'}) );
      this.store.dispatch( GetUnits() );
    }

  ngOnInit(): void {}

}
