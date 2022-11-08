import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AppGlobalFilterComponent } from '../app-global-filters/app-global-filters.component';
import { IGlobalFilter, AlertService } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-filter',
  templateUrl: './app-filter.component.html',
})
export class AppFilterComponent implements OnInit {
  @Input() globalFilters: IGlobalFilter[];
  @Input() showDialogFilter: boolean = true;
  @Output() filtersApplied: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogService: DialogService,
    private alertService: AlertService
  ) {}

  /**
   * Assignment of selected columns on page load
   */
  ngOnInit(): void {}

  /**
   * Opens the filter dialog
   */
  openFilters() {
    const ref = this.dialogService.open(AppGlobalFilterComponent, {
      header: 'Choose Filters',
      width: '70%',
      styleClass: 'global-filter-visible',
      data: { globalFilters: this.globalFilters, openDialog: true },
    });

    // Modal response
    ref.onClose.subscribe(
      (res) => {
        console.log('res:', res);
        if (res) {
          this.filtersApplied.emit(res);
        }
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }

  globalFiltersApplied(event: any) {
    this.filtersApplied.emit(event);
  }
}
