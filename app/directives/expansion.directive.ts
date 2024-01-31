import { Directive, Input } from "@angular/core";

@Directive({
  selector: 'appExpandable, [appExpandable]',
  exportAs: 'appExpandable'
})
export class ExpansionDirective {
  @Input('appExpandableChildren') Children!: any[];
  public Collapsed: boolean = false;
}