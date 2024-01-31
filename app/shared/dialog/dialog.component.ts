import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <div mat-dialog-content><p>{{data.text}}</p></div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>{{'BUTTONS.CLOSE' | translate}}</button>
    </div>
`
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}