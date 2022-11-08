import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import {
  IGlobalFilter,
  GridFilterControlType,
  EGridColumnType,
  EDayRange,
} from '../../models';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/app/services/alert.service';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-global-filters',
  templateUrl: './app-global-filters.component.html',
  styleUrls: ['./app-global-filters.component.scss'],
})
export class AppGlobalFilterComponent implements OnInit {
  @Input() globalFilters: IGlobalFilter[] = [];
  @Output() filtersApplied: EventEmitter<any> = new EventEmitter();

  public fiterTypes = GridFilterControlType;
  public columnType = EGridColumnType;
  public showDialog: boolean = false;
  public startDate: Date;
  public endDate: Date;

  showInput: boolean = false;
  filter: any = '';

  constructor(
    public datepipe: DatePipe,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private gridService: GridService,
    public dialogService: DialogService,
    private alertService: AlertService
  ) {}

  /**
   * Assignment of selected columns on page load
   */
  ngOnInit(): void {
    if (this.config && this.config.data) {
      this.showDialog = this.config.data.openDialog;
      if (this.config.data.globalFilters) {
        this.globalFilters = this.config?.data.globalFilters as IGlobalFilter[];
      }
      // set By Defualt Calender Range
      this.setDefualtCalendarRange();
    }
  }

  ngOnChanges() {
    this.globalFilters?.forEach((filter) => {
      if (
        filter.value &&
        (filter.hidden === false || filter.hidden === undefined)
      ) {
        this.onFocusOutEvent(filter);
      }
    });
    // set By Defualt Calender Range
    this.setDefualtCalendarRange();
  }

  onFocusOutEvent(globalFilter: IGlobalFilter) {
    if (globalFilter && globalFilter.onFocusOut) {
      globalFilter.onFocusOut(globalFilter);
    }
    setTimeout(
      () => {
        localStorage.setItem('applyFilter', JSON.stringify(false));
        this.filtersApplied.emit(this.globalFilters);
      },
      globalFilter.type === GridFilterControlType.LOOKUP_INPUT ? 250 : 0
    );
  }

  /**
   * Apply selected filters
   */
  applyFilters() {
    localStorage.setItem('applyFilter', JSON.stringify(true));
    if (this.showDialog) {
      this.ref.close(this.globalFilters);
    } else {
      this.filtersApplied.emit(this.globalFilters);
    }
  }

  // set By Defualt Calender Range
  setDefualtCalendarRange() {
    if (this.globalFilters && this.globalFilters.length > 0) {
      this.globalFilters.forEach((filter) => {
        if (filter.filtering === undefined) {
          filter.filtering = true;
        }
        if (filter.type === GridFilterControlType.CALENDAR_RANGE) {
          setTimeout(() => {
            this.showNext(filter);
          }, 100);
        }
      });
    }
  }

  showNext(filter: IGlobalFilter): string {
    let nextValue: string;
    let dayRange: EDayRange = filter.dayRange
      ? filter.dayRange
      : EDayRange.WEEK;
    switch (dayRange) {
      case EDayRange.DAY:
        nextValue = this.setDayFilter(filter, true);
        break;
      case EDayRange.MONTH:
        nextValue = this.setMonthFilter(filter, true);
        break;
      case EDayRange.YEAR:
        nextValue = this.setYearFilter(filter, true);
        break;
      default:
        // week
        nextValue = this.setWeekFilter(filter, true);
        break;
    }
    localStorage.setItem('applyFilter', JSON.stringify(true));
    this.filtersApplied.emit(this.globalFilters);
    return nextValue;
  }

  showPrevious(filter: IGlobalFilter): string {
    let previousValue: string;
    let dayRange: EDayRange = filter.dayRange
      ? filter.dayRange
      : EDayRange.WEEK;
    switch (dayRange) {
      case EDayRange.DAY:
        previousValue = this.setDayFilter(filter, false);
        break;
      case EDayRange.MONTH:
        previousValue = this.setMonthFilter(filter, false);
        break;
      case EDayRange.YEAR:
        previousValue = this.setYearFilter(filter, false);
        break;
      default:
        // week
        previousValue = this.setWeekFilter(filter, false);
        break;
    }
    localStorage.setItem('applyFilter', JSON.stringify(true));
    this.filtersApplied.emit(this.globalFilters);
    return previousValue;
  }

  setCalendarRangeFilterValue(filter: IGlobalFilter): string {
    return (filter.value =
      this.datepipe.transform(
        this.startDate,
        filter.format ? filter.format : 'MM/dd/yyyy'
      ) +
      '|' +
      this.datepipe.transform(
        this.endDate,
        filter.format ? filter.format : 'MM/dd/yyyy'
      ));
  }

  setDateValue(filter) {
    let value: Date;
    if (filter.value) {
      value = new Date(filter.value.split('|')[0]);
      return new Date(value.setMonth(value.getMonth()));
    } else {
      return new Date();
    }
  }

  setDayFilter(filter: IGlobalFilter, isNext: boolean): string {
    var currentDate = this.setDateValue(filter);
    if (isNext) {
      this.startDate = this.startDate
        ? new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate() + 1
          )
        : currentDate;
    } else {
      this.startDate = this.startDate
        ? new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate() - 1
          )
        : currentDate;
    }

    this.endDate = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth(),
      this.startDate.getDate() + 1
    );

    return this.setCalendarRangeFilterValue(filter);
  }

  setYearFilter(filter: IGlobalFilter, isNext: boolean): string {
    var currentDate = this.setDateValue(filter);
    var firstDateOfYear = new Date(currentDate.getFullYear(), 0, 1);

    if (isNext) {
      this.startDate = this.startDate
        ? new Date(this.startDate.getFullYear() + 1, 0, 1)
        : firstDateOfYear;
    } else {
      this.startDate = this.startDate
        ? new Date(this.startDate.getFullYear() - 1, 0, 1)
        : firstDateOfYear;
    }

    this.endDate = new Date(this.startDate.getFullYear(), 11, 31);

    return this.setCalendarRangeFilterValue(filter);
  }

  setMonthFilter(filter: IGlobalFilter, isNext: boolean): string {
    var currentDate = this.setDateValue(filter);
    var firstDateOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    if (isNext) {
      this.startDate = this.startDate
        ? new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth() + 1,
            1
          )
        : firstDateOfMonth;
    } else {
      this.startDate = this.startDate
        ? new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth() - 1,
            1
          )
        : firstDateOfMonth;
    }

    this.endDate = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth() + 1,
      0
    );

    return this.setCalendarRangeFilterValue(filter);
  }

  setWeekFilter(filter: IGlobalFilter, isNext: boolean): string {
    let currentDate = this.setDateValue(filter);
    let firstDay = new Date(
      currentDate.setDate(
        filter.value
          ? currentDate.getDate()
          : currentDate.getDate() - currentDate.getDay() + 1
      )
    );
    let weekSeconds = 7 * 24 * 60 * 60 * 1000;

    if (isNext) {
      this.startDate = this.startDate
        ? new Date(this.startDate.getTime() + weekSeconds)
        : new Date(firstDay.getTime());
    } else {
      this.startDate = this.startDate
        ? new Date(this.startDate.getTime() - weekSeconds)
        : new Date(firstDay.getTime() - weekSeconds);
    }

    this.endDate = new Date(this.startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    return this.setCalendarRangeFilterValue(filter);
  }

  /**
   * open dialog on lookupControl field
   */
  selectLookupField(globalFilters: IGlobalFilter) {
    this.gridService.setLookUpFilter(globalFilters, this.dialogService);
  }

  /**
   * Clear all filter values
   */
  clearFilters() {
    this.globalFilters.map((item) => (item.value = null));
  }

  /**
   * Close dialog without applying filters
   */
  cancel() {
    this.clearFilters();
    this.ref.close();
  }

  filterInput() {
    this.showInput = !this.showInput;
  }
}
