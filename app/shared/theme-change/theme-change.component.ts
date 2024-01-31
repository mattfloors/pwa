import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-theme-change',
  templateUrl: './theme-change.component.html',
  styleUrls: ['./theme-change.component.scss']
})
export class ThemeChangeComponent implements OnInit {
  @Input() Data!: any[];
  @Input() formGroup!: FormGroup;
  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngOnInit(): void {}

}
