import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { IMessages } from '../../../models/messages.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() Data!: IMessages;
  @HostBinding('class.mine') @Input() Mine!: boolean;
  constructor() { }

  ngOnInit(): void {}

}
