import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { QuarComponent } from '@altack/quar';

@Component({
  selector: 'app-qr-code',
  template: `
    <button 
      style="
        left: calc(100% - 40px);
        top: -18px;
        position: relative;
      "
      mat-button 
      class="close-icon" 
      [mat-dialog-close]="true">
      <mat-icon>close</mat-icon>
    </button>
    <quar-scanner style="width: 300px; height: 300px" (scanSuccess)="onSuccess($event)" (scanError)="onError($event)"></quar-scanner>
  `,
  styles: []
})
export class QRCodeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onSuccessEvent = new EventEmitter<string>();
  @ViewChild(QuarComponent) private quar!: QuarComponent;
  ngOnInit() {}
  ngAfterViewInit() {
  }
  ngOnDestroy() {
    // this.Action.stop();
  }
  onError(error: any) {
    console.log('onError', error);
    // this.Action.stop();
  }
  onSuccess(data: any) { 
    console.log('onSuccess', data);
    if(data){
      this.onSuccessEvent.emit(data);
      // this.Action.stop();
    }
  }
}

