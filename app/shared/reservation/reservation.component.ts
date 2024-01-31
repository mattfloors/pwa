import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IReservation } from '../../models/reservation.model';
import { AppState } from '../../store';
import { GetLanguage } from '../../store/ui/selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  @Input() Data!: IReservation | null;
  @Input() Text!: any;
  public Lang: string = 'it-IT';
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.pipe( select( GetLanguage), map( l => l || 'it-IT'),
    takeUntil( this.destroy$ ) ).subscribe( i => this.Lang = i )
  }

}
