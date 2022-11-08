import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  public note: string = '';
  public disabledText: boolean = false;

  ngOnInit(): void {
    this.disabledText = this.config.data.disabledText;
    this.note = this.config.data.value ?? '';
  }

  handleCancel() {
    this.ref.close();
  }

  // TODO: SEND CORRECT API REQUEST
  handleOk() {
    this.ref.close(this.note);
  }
}
