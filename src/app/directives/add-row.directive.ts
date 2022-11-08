import { Directive, Input, HostListener } from '@angular/core';
import { Table } from 'primeng/table';

@Directive({
  selector: '[pAddRow]',
})
export class AddRowDirective {
  @Input() table: Table;
  @Input() newRow: any;
  @Input() id: string;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Insert a new row
    if (this.table && this.table.value) {
      this.table.value.unshift({
        ...this.newRow,
        [this.id]: Date.now(),
        isNew: true,
      });
    }

    // Set the new row in edit mode
    this.table.initRowEdit({
      ...this.newRow,
      [this.id]: Date.now(),
      isNew: true,
    });

    event.preventDefault();
  }
}
