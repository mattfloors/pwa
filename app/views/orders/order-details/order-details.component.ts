import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
// @check time position
@Component({
  selector: 'app-order-detail',
  template: `
    <table>
      <!--<tr> 
        <th style="text-align: left;">{{'CODE' | translate}} </th>
        <td>{{data?.Codice}}</td>
      </tr>-->
      <tr> 
        <th style="text-align: left;">{{'DESCRIPTION' | translate}} </th> <!-- modifcare da json -->
        <td>{{data?.Descrizione}}</td>
      </tr>
      <tr> 
        <th style="text-align: left;">{{'PRICE' | translate}} </th> <!-- modifcare da json -->
        <td>{{data?.PrezzoImporto1 | currency}}</td>
      </tr>
      <tr> 
        <th style="text-align: left;">{{'PREPARATION' | translate}} </th> <!-- modifcare da json -->
        <td>{{data?.Preparazione}}</td>
      </tr>
      <tr> 
        <th style="text-align: left;">{{'RECIPE' | translate}}</th> <!-- modifcare da json -->
        <td>{{data?.Ricetta}}</td>
      </tr>
    </table>
  `
})
export class OrderDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}