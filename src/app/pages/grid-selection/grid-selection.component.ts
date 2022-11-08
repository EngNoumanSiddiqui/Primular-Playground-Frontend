import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectionComponent } from './selection.component';
import { AlertService } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-grid-selection',
  templateUrl: './grid-selection.component.html',
  styleUrls: ['./grid-selection.component.scss'],
})
export class GridSelectionComponent implements OnInit {
  selectedRows: any = [];

  constructor(
    public dialogService: DialogService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  openSelection() {
    const ref = this.dialogService.open(SelectionComponent, {
      header: 'Grid Selection',
      width: '70%', //Popup height and width customizable property.
      height: '80%',
      data: { selectedRows: this.selectedRows },
    });

    ref.onClose.subscribe(
      (response) => {
        console.log('grid selcted rows:', response);
        this.selectedRows = response;
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }
}
