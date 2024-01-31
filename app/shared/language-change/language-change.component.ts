import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.scss']
})
export class LanguageChangeComponent implements OnInit {
  @Input() Data!: any[];
  @Input() formGroup!: FormGroup;
  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
  }

}
