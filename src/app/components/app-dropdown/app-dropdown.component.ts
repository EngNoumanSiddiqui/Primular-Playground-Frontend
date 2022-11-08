import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ISelectItem } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-dropdown',
  templateUrl: './app-dropdown.component.html',
})
export class AppDropDownComponent implements OnChanges {
  @Input() options: ISelectItem[] = [];
  @Input() value: ISelectItem;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  public selectedOption: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.options.length) {
      if (this.value) {
        this.selectedOption = changes['value'].currentValue.toString().trim();
      } else {
        this.selectedOption = this.options[0];
        this.valueChange.emit(this.selectedOption.value);
      }
    }
  }

  handleValueChange(event: { value: string }) {
    this.valueChange.emit(event.value);
  }
}
