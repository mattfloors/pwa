import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tab-navigation',
  templateUrl: './tab-navigation.component.html',
  styleUrls: ['./tab-navigation.component.scss']
})
export class TabNavigationComponent implements OnInit {

  constructor(private elementRef: ElementRef, private render: Renderer2) { }

  ngOnInit(): void {
    this.render.addClass(this.elementRef.nativeElement, 'mat-app-background');
  }

}
