import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {
  constructor(private elt: ElementRef<HTMLElement>) {}

  ngAfterContentInit() {
    setTimeout(() => this.elt.nativeElement.focus());
  }
}
