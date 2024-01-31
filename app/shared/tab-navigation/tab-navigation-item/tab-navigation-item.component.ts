import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-tab-navigation-item, [app-tab-navigation-item]',
  templateUrl: './tab-navigation-item.component.html',
  styleUrls: ['./tab-navigation-item.component.scss']
})
export class TabNavigationItemComponent extends MatButton implements OnInit {
  @HostBinding('attr.tabindex') tabindex = 1;
  // constructor(private elementRef: ElementRef) {
  constructor(elementRef: ElementRef, focusMonitor: FocusMonitor) {
    super(elementRef, focusMonitor, '');
    // elementRef.nativeElement.classList.add('mat-raised-button')
    elementRef.nativeElement.classList.add('mat-button')

   }
  ngOnInit() {

  }

}
