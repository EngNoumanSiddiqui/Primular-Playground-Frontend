import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnChanges,
  Optional,
  ElementRef,
  ViewChildren,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { GridService } from 'src/app/services/grid.service';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import {
  IGridSort,
  IPrimeNgSort,
  IPrimeNgFilter,
  IGridPaginationEvent,
  EGridSortDirection,
  IGridDataExport,
  EGridAggregate,
  EAggregateFormat,
  ILookupValue,
} from 'src/app/models';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import {
  EGridColumnType,
  EGridSelectionType,
  IGlobalFilter,
  IGridColumn,
  IGridColumnAction,
  IGridFilter,
  IGridRowAction,
  IGridServerSideEvent,
} from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EPermissionType, IPermission, IUserInfo } from 'src/app/models';
import { AlertService } from 'src/app/services/alert.service';
import { IframeComponent } from '../iframe/iframe.component';
import { WorkSheet } from 'xlsx';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as utilities from '../../services/utilities.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges {
  @ViewChildren('gridRow') gridRow: QueryList<ElementRef>;
  serverFilters: IGridServerSideEvent = {};
  rowsData: any[];
  roles: string[] = [];
  isColumnHidden: boolean = false;
  rowClickData: IGridColumn;
  lookupObject: ILookupValue;
  backspaceColumn: IGridColumn;
  globalFiltersArray: any[] = [];
  checkAction: boolean = false;

  // apply checked/unChecked prop for CheckBox of the Table
  checked: boolean = true;
  unChecked: boolean = false;

  //apply Add/Delete/Edit prop for the grid permission
  addRowPermission: boolean = true;
  deleteRowPermission: boolean = true;
  editRowPermission: boolean = true;

  // apply checked/unChecked prop for CheckBox of the Table when in Edit Mode
  editModeChecked: boolean = true;
  editModeunCkecked: boolean = false;

  // Apply prop setAggregateFooter on Footer of the Table for aggregate.
  setAggregateFooter: string = '';

  // Boolean prop to allow Hide Aggregate Footer When Aggregate not Apply on Table.
  aggregateFooter: boolean = false;

  // Maintains previous state of rows being edited
  editRowsRecords: { [key: string]: any } = {};

  // Maintains record of rows being edited
  editingRowKeys: { [key: string]: any } = {};

  // Selects items in the grid based on passed on data
  @Input() selectedRows: any = [];

  private globalData: IGridFilter[] = [];

  // Stores selected columns
  private _selectedColumns: IGridColumn[] = [];

  @ViewChild('dt') table: Table;

  // Boolean prop to allow horizontal Scroll on Table.
  @Input() horizontalScroll: boolean = false;

  // Prop to handle loader of grid
  @Input() public loading = false;

  // Boolean prop to check where selected is allowed or not.
  @Input() allowSelection = false;

  // Set column width of selected row.
  @Input() selectionColumnWidth: string = '80px';

  // Boolean prop to allow export to pdf.
  @Input() allowExportToPdf = false;

  // Boolean prop to allow export to excel.
  @Input() allowExportToExcel = false;

  // If true, enables options to perform CRUD using inline row functionality
  @Input() useInlineCRUD = false;

  // Array of row actions
  @Input() rowActions: IGridRowAction[] = [];

  // Sets selection type i.e: single/multiple selection
  @Input() selectionType: EGridSelectionType = EGridSelectionType.SINGLE;

  // Unique key requires for built-in row selection of primeNg grid
  @Input() dataKey: string;

  // Flag in case table is scrollable
  @Input() scrollable = false;

  // Sets scroll height for the table
  @Input() scrollHeight = '680px';

  // Boolean prop to allow to wrap or unWrap the grid.
  @Input() wordWrap: boolean = false;

  @Input() newGridRow = {};

  @Input() filtering = true;

  @Input() rowHover: boolean = false;

  @Input() hideFilterOptions: boolean = false;

  // Sets pagenation for the table Data.
  @Input() setPaginationLength: any[] = [10, 20, 30, 40, { showAll: 'All' }];

  // set property allowCaching for LocalStorage
  @Input() allowCaching: boolean = false;

  /**
   * Stops the loader and sets the data to grid
   * Clears the editing stack
   * Scrolls to selected element if selection found
   */
  @Input() set rows(data: any[]) {
    this.loading = false;
    if (data && data.length > 0) {
      if (!this.dataKey) {
        this.dataKey = 'id';
      }
      this.rowsData = this.gridService.setDataFields(data, this.dataKey);
    } else {
      this.rowsData = [];
    }

    // Cleaning the editing stack
    this.editingRowKeys = {};
    this.editRowsRecords = {};

    setTimeout(() => {
      if (data && data.length > 0 && this.selectedRows) {
        const selectedElementRef = this.gridRow.find(
          (x) => x.nativeElement.id === this.selectedRows[this.dataKey]
        );
        selectedElementRef &&
          (selectedElementRef.nativeElement as HTMLTableRowElement).scrollIntoView(
            { behavior: 'smooth' }
          );
      }
    }, 0);

    //manipulate checkbox string value to true and false.
    this.changeCheckboxStringValue();
  }

  // Global filter server request
  @Input() set globalFilterData(globalFilters: IGlobalFilter[]) {
    this.globalData = this.gridService.prepareGlobalFilters(globalFilters);
    const serverFilterValues = JSON.parse(JSON.stringify(this.serverFilters));
    serverFilterValues.filters = this.serverFilters.filters
      ? this.serverFilters.filters.concat(this.globalData)
      : this.globalData;

    if (localStorage.getItem('applyFilter') === 'false') {
      this.globalFiltersArray = this.globalFiltersArray
        ? this.globalFiltersArray.concat([...serverFilterValues.filters])
        : this.globalFiltersArray;
    }
    if (localStorage.getItem('applyFilter') === 'true') {
      globalFilters.forEach((globalFilter) => {
        this.globalFiltersArray.forEach((filterArray) => {
          if (
            filterArray.field === globalFilter.field &&
            globalFilter.value &&
            filterArray.value !== globalFilter.value
          ) {
            filterArray.value = globalFilter.value;
          }
          const findIndex = this.globalFiltersArray.findIndex(
            (index) => index.field === globalFilter.field && !globalFilter.value
          );
          if (findIndex !== -1) {
            this.globalFiltersArray.splice(findIndex, 1);
          }
        });
      });

      this.loading = true;
      setTimeout(() => {
        if (this.globalFiltersArray && this.globalFiltersArray.length > 0) {
          serverFilterValues.filters = serverFilterValues.filters.concat(
            this.globalFiltersArray
          );
        }
        serverFilterValues.filters = Array.from(
          new Set(
            serverFilterValues.filters.reverse().map((filter) => filter.field)
          )
        ).map((field) => {
          return serverFilterValues.filters.find((x) => x.field === field);
        });
        serverFilterValues.filters = serverFilterValues.filters.filter(
          (obj) => {
            return obj.value !== '';
          }
        );
        this.onServerSideEventChange.emit(serverFilterValues);
        localStorage.removeItem('applyFilter');
      }, 300);
    }
  }
  // Input decorator to receive columns to be displayed in header
  @Input() columns: IGridColumn[] = [];

  @Input() permissions: IPermission[] = [];

  // Optional prop to handle toggling of columns
  @Input() allowColumnToggle = false;

  // Optional prop to hide filtering of columns
  @Input() hideFilter = false;

  // Optional prop to handle lookup filters
  @Input() lookupFilters = false;

  // Optional prop to handle pagination
  @Input() pagination = false;

  // Optional prop to handle show CurrentPage Report
  @Input() showCurrentPageReport = false;

  // Displays total number of records
  @Input() totalRecords = 0;

  // Sets number of rows to be shown the grid
  @Input() defaultRows: number;

  @Input() columnActions: IGridColumnAction[] = [];

  // Decides the grid's behavior either for client side or server side events
  @Input() useServerSideEvents = false;

  // Output event to handle row click
  @Output() onRowClick: EventEmitter<any> = new EventEmitter();

  // Output event to handle row CheckBox
  @Output() onRowCheckBox: EventEmitter<any> = new EventEmitter();

  // Output event to trigger on sort change
  @Output() onSortChange: EventEmitter<IGridSort> = new EventEmitter();

  // Output event to trigger on filter change
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  // Calls whenever a lazy event is dispatched
  @Output()
  onServerSideEventChange: EventEmitter<IGridServerSideEvent> = new EventEmitter();

  // Output event to trigger on pagination
  @Output()
  onPageChange: EventEmitter<IGridPaginationEvent> = new EventEmitter();

  // Dispatch output event trigger on edit row
  @Output() onRowUpdate = new EventEmitter();

  // Dispatch output event trigger on delete row
  @Output() onRowDelete = new EventEmitter();

  //Dispatch output event trigger on add row
  @Output() onRowAdd = new EventEmitter();

  @Output() inlineRowCancel = new EventEmitter();

  // set the row When Edit the row on Grid
  @Output() onGridRowEdit = new EventEmitter();

  // set the row When adding the new Row on Grid
  @Output() onGridRowAdd = new EventEmitter();

  isGridHidden: boolean = false;

  constructor(
    private gridService: GridService,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef,
    public dialogService: DialogService,
    public decimalPipe: DecimalPipe,
    public confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    @Optional() public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef
  ) {}

  get selectedColumns(): IGridColumn[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: IGridColumn[]) {
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
    console.log('set', this._selectedColumns);
  }

  /**
   * Assignment of selected columns on page load
   */
  ngOnInit(): void {}

  // apply user role permissions on grid columns
  applyColumnsPermissions() {
    if (this.columns) {
      let totalFields: number = 0;
      let hiddenFields: number = 0;

      this.columns.forEach((column) => {
        let permissions: IPermission[] = column.permissions;
        if (!permissions) permissions = this.permissions;
        let hasValidEditPermission = false;

        if (permissions && permissions.length > 0) {
          permissions.forEach((permission) => {
            let isValid: boolean = false;
            if (permission.roles && permission.roles.length > 0) {
              permission.roles.forEach((role) => {
                if (!isValid && this.roles && this.roles.includes(role)) {
                  isValid = true;
                } else {
                  let index = this.columns.findIndex(
                    (i) => i.field === column.field
                  );
                  if (index !== -1) {
                    this.columns.splice(index, 1);
                  }
                }
              });
              if (
                permission.type === EPermissionType.VIEW &&
                !hasValidEditPermission
              ) {
                if (isValid) {
                  column.disabled = true;
                } else {
                  column.hidden = true;
                }
              } else if (permission.type === EPermissionType.EDIT) {
                if (isValid) {
                  hasValidEditPermission = true;
                  column.hidden = false;
                  column.disabled = false;
                }
              }
            }
          });
        }

        totalFields++;

        if (column.hidden) {
          hiddenFields++;
        }
      });

      this.isColumnHidden = totalFields > 0 && totalFields === hiddenFields;
    }
  }

  // apply global permissions on entire grid
  applyGridPermissions() {
    if (this.permissions && this.permissions.length > 0) {
      let hasValidEditPermission = false;

      // check if any column has any permission
      let hasColumnPermissions = this.columns.some(
        (x) => x.permissions && x.permissions.length > 0
      );

      this.permissions.forEach((permission) => {
        let isValid: boolean = false;

        permission.roles.forEach((role) => {
          if (!isValid && this.roles && this.roles.includes(role)) {
            isValid = true;
          }
        });

        if (
          permission.type === EPermissionType.VIEW &&
          !hasValidEditPermission
        ) {
          this.useInlineCRUD = true;
          if (!isValid && !hasColumnPermissions) {
            this.isGridHidden = true;
            this.useInlineCRUD = false;
          }
        } else if (permission.type === EPermissionType.EDIT && !isValid) {
          this.isGridHidden = false;
          hasValidEditPermission = true;
          this.editRowPermission = false;
        } else if (permission.type === EPermissionType.DELETE && !isValid) {
          this.deleteRowPermission = false;
        } else if (permission.type === EPermissionType.ADDROW && !isValid) {
          this.addRowPermission = false;
        }
      });
    }
    if (this.onRowDelete.observers.length == 0)
      this.deleteRowPermission = false;
    if (this.onRowUpdate.observers.length == 0) this.editRowPermission = false;
    if (this.onRowAdd.observers.length == 0) this.addRowPermission = false;
  }

  ngOnChanges(change: SimpleChanges) {
    // add defaultRow in pagination array
    if (!this.setPaginationLength.includes(this.defaultRows)) {
      this.setPaginationLength.unshift(this.defaultRows);
    }

    const hasColumns: boolean = this.columns && this.columns.length > 0;
    if (hasColumns) {
      this.columns = this.gridService.setColumnFields(this.columns);
    }

    this.roles = this.authService.getUserRoles();

    // apply user role permissions on grid columns
    this.applyColumnsPermissions();

    // apply global permissions on entire grid
    this.applyGridPermissions();

    this._selectedColumns = this.columns.filter((x) => !x.hidden);
    this.cd.detectChanges();

    if (hasColumns) {
      this.columns = this.gridService.setColumnFields(this.columns);

      //Aggregate scenario
      this.columns.forEach((column) => {
        if (column.filter && column.value && column.filtering !== false) {
          this.setFilterFocusOut(column);
        }
        // add "flex-shrink: 0" for flex-basis Style
        if (column.style && column.style.includes('flex-basis')) {
          let style = column.style + ' !important; flex-shrink: 0 !important';
          column.style = style.includes(';;')
            ? style.replace(';;', ';')
            : style;
        }

        // set DisplayText when value is in curly brackets.
        this.setDisplayTextValue(column);

        if (column.aggregate && column.aggregate.length > 0) {
          this.aggregateFooter = true;
          this.setAggregateText(column);
        }
        let searchFilters = JSON.parse(
          localStorage.getItem('SetFilters-' + utilities.currentUrl()) as any
        );
        if (
          searchFilters &&
          searchFilters.filters &&
          searchFilters.filters.length > 0
        ) {
          searchFilters.filters.forEach((x) => {
            if (x.value && x.field === column.field) {
              column.value = x.value;
            }
          });
        }
        // converting displayField toLowercase
        if (column.displayField) {
          column.displayField = column.displayField.toLowerCase();
        }
      });

      // Searching scenario
      if (change.rows?.currentValue && change.columns?.currentValue) {
        // Checks either column value is changes (i.e., column hidden scenario)
        if (
          JSON.stringify(change.columns.currentValue).toLowerCase() !==
          JSON.stringify(this.columns).toLowerCase()
        ) {
          this._selectedColumns = [];
          this.columns.forEach((x, i) => {
            if (!x.hidden) {
              if (this.selectedColumns[i]) {
                x.value = this.selectedColumns[i].value;
              }
              this._selectedColumns.push(x);
            }
          });
        }
      } else {
        this._selectedColumns = [];
        this.columns.forEach((x, i) => {
          if (!x.hidden) {
            if (this.selectedColumns[i]) {
              x.value = this.selectedColumns[i].value;
            }
            this._selectedColumns.push(x);
          }
        });
      }

      setTimeout(() => {
        const classElement = document.getElementsByClassName('highlighted-row');
        if (classElement.length > 0) {
          classElement[0].scrollIntoView();
        }
      }, 500);
    }
  }

  // set DisplayText when value is in curly brackets.
  setDisplayTextValue(column: IGridColumn) {
    this.rowsData?.forEach((row) => {
      if (
        column.type === EGridColumnType.LINK ||
        EGridColumnType.DIALOG ||
        EGridColumnType.IFRAME
      ) {
        const field = row[column.field + '_obj'];
        if (column.displayText && column.displayText.includes('{')) {
          const displayText = column.displayText
            .replace('{', '')
            .replace('}', '');
          if (displayText && field) {
            field.displayText = row[displayText.toLowerCase()];
          }
        } else if (column.displayText && field) {
          field.displayText = column.displayText;
        }
      }
    });
  }

  //manipulate checkbox string value to true and false.
  changeCheckboxStringValue() {
    if (
      this.columns &&
      this.rowsData &&
      this.rowsData.length > 0 &&
      this.columns.length > 0
    ) {
      this.rowsData.forEach((row) => {
        this.columns.forEach((column) => {
          if (column.type === EGridColumnType.BOOLEAN) {
            if (
              (typeof (row[column.field] === 'string') &&
                (row[column.field] === '1' || row[column.field] === '0')) ||
              row[column.field] === 'Y' ||
              row[column.field] === 'N'
            ) {
              row[column.field] =
                row[column.field] === '1' || row[column.field] === 'Y'
                  ? true
                  : false;
            }
          }
        });
      });
    }
  }

  /**
   *
   * @param rowData
   * Passes data of clicked row to parent
   */
  handleRowClick(rowData) {
    this.rowClickData = rowData;
    this.onRowClick.emit(rowData);
  }

  /**
   *
   * @param columnData
   * Passes sorting information to parent on sort change
   */
  handleSortChange(event: IPrimeNgSort) {
    console.log('Event: ', event);
    let sortDirection = null;
    let sortField: string = '';
    if (event.multisortmeta && event.multisortmeta[0].order) {
      sortDirection =
        event.multisortmeta[0].order == 1
          ? EGridSortDirection.ASC
          : EGridSortDirection.DESC;
      sortField = event.multisortmeta[0].field;
    }
    let sorts: IGridSort = {
      field: sortField,
      direction: sortDirection,
      priority: null,
    };
    this.onSortChange.emit(sorts);
  }

  /**
   *
   * @param event
   * Passes applied filters to parent on filter change
   */
  handleFilterChange(event: any) {
    console.log('*event:', event);
    this.columns.forEach((filter) => {
      if (!event.filters[filter.field]?.value) {
        filter.value = '';
      }
    });
    this.onFilterChange.emit(event);
  }

  /**
   *
   * @param event : Event
   * @param columnAction : IGridColumnAction
   * @param row : any
   * Stop the click event propagation to parent
   * Callbacks the row data to parent
   */

  /**
   * invoke onClick event & open Iframe in grid
   */
  gridIFrame(column: any, rows: any, row) {
    if (column && column.onClick) {
      column.onClick(row);
    }
    const ref = this.dialogService.open(IframeComponent, {
      header: column.header,
      width: '80%',
      height: '80%',
      data: { value: rows, iFrameId: column.displayText },
    });
    ref.onClose.subscribe((res) => {
      if (res && column.onReturn) {
        column.onReturn(res);
      }
    });
  }

  addNewRow(row, addRow: boolean = false) {
    this.columns.forEach((column) => {
      if (
        column.filter &&
        column.component &&
        column.filter.type === 'calendar'
      ) {
        if (addRow) {
          this.rowsData[0][column.field + '_secondType'] = EGridColumnType.DATE;
        } else {
          row[column.field + '_secondType'] = EGridColumnType.DATE;
        }
      }
    });
    this.onGridRowAdd.emit(row);
  }

  /**
   * open Dialog in grid
   */
  openGridDialog(column: IGridColumn) {
    setTimeout(() => {
      if (column.component && column.data && this.rowClickData) {
        const keys = Object.keys(this.rowClickData);
        column.data.data = utilities.autoSetLookupData(
          column.data.data,
          this.rowClickData
        );
        const ref = this.dialogService.open(column.component, column.data);
        ref.onClose.subscribe((data: any) => {
          if (data && column.onReturn) {
            column.onReturn(data);
          }
        });
      }
    }, 10);
  }

  /**
   * open Delete Confirmation dialog when click on delete icon in Action column
   */
  handleActionClick(event: Event, columnAction: IGridColumnAction, row: any) {
    event.stopPropagation();
    if (columnAction.tooltip.toLowerCase() === 'delete') {
      if (columnAction.confirmDialog === false) {
        columnAction.onClick(row);
      } else {
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this record?',
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          key: 'handlecolumnActions',
          accept: () => {
            columnAction.onClick(row);
            this.confirmationService.close();
          },
          reject: () => {
            this.confirmationService.close();
          },
        });
      }
    } else {
      columnAction.onClick(row);
    }
  }

  /**
   *
   * @param event : LazyLoadEvent
   * Triggers everytime a server side filter is trigger
   */
  handleServerSideEvents(event: any) {
    this.selectedColumns.forEach((x) => {
      if (event.filters[x.field]) {
        event.filters[x.field].value = x.value;
      }
    });
    this.loading = true;
    this.serverFilters = {
      filters: this.lookupFilters
        ? this.gridService.getGridFilters(event, this.selectedColumns)
        : this.gridService.prepareBasicFilters(event, this.selectedColumns),
      sorts: this.gridService.getGridSorts(event, this.selectedColumns),
      ...(this.pagination && {
        page: this.gridService.getGridPagination(event),
        pageSize: event.rows || 10,
      }),
    };

    console.log('*this.globalData', this.globalData);
    console.log('*this.serverFilters', this.serverFilters);

    if (
      this.serverFilters?.filters &&
      this.serverFilters?.filters.length > 0 &&
      this.allowCaching
    ) {
      localStorage.setItem(
        'SetFilters-' + utilities.currentUrl(),
        JSON.stringify(this.serverFilters)
      );
    }

    const serverFilterValues = JSON.parse(JSON.stringify(this.serverFilters));
    serverFilterValues.filters = this.serverFilters.filters.concat(
      this.globalData
    );
    this.onServerSideEventChange.emit(serverFilterValues);
  }

  /**
   * @param event
   * Passes applied pagination to parent on page change
   */
  handleServerSidePagination(event: IGridPaginationEvent) {
    this.onPageChange.emit(event);
  }

  selectedRow(row: any) {
    this.onRowCheckBox.emit(row);
  }

  /**
   *
   * @param row
   * Sets values to editable row
   * Row's data is preseved to prevent mutation
   * Row dataKey is preserved to keep the row unique and in editable state as long as not saved
   */

  onRowEditInit(row: any) {
    console.log({ row });
    let selectedRow = { ...row };
    Object.entries(selectedRow).forEach(([key, value]: any) => {
      this.columns.forEach((col) => {
        this.setDropdownFilterValue(col, row, key);

        if (col.type === EGridColumnType.DROPDOWN) {
          let option = col.data.find(
            (x) => x.label === row[col.field]?.toString()
          );
          if (option) {
            row[col.field] = option.value;
          }
        }
        if (
          col.field?.toLowerCase() === key?.toLowerCase() &&
          col.type === EGridColumnType.DATE
        ) {
          if (row[col.field] !== null) {
            row[key] = new Date(value as string);
          }
        }
        if (
          col.type === EGridColumnType.DIALOG &&
          col.filter.type === 'calendar' &&
          col.field.toLowerCase() === key.toLowerCase()
        ) {
          if (value === null) {
            row[key] = new Date();
          } else {
            row[col.field] = new Date(value);
          }
        }
      });
    });

    this.editRowsRecords[row[this.dataKey]] = { ...row };
    this.editingRowKeys[row[this.dataKey]] = true;
    this.addNewRow(row);
    this.checkAction = true;
    this.onGridRowEdit.emit(row);
  }

  typeOf(value) {
    return typeof value;
  }

  /**
   * set dropdown filter value
   */
  setDropdownFilterValue(col: IGridColumn, row: any, key: string) {
    if (col.type === EGridColumnType.DROPDOWN && col.dropDownProp) {
      if (Object.values(col).some((value) => value == key)) {
        let obj = col.dropDownProp;
        let newFilters = [];

        if (obj.filters && obj.filters.length > 0) {
          obj.filters.forEach((filter) => {
            let newFilter = { ...filter };
            let filterKey = Object.keys(row).find((key) => {
              let matchKey: string = '';
              if (
                filter.value?.includes('{') &&
                key.toLowerCase() ===
                  filter.value
                    ?.toString()
                    ?.toLowerCase()
                    .replace('{', '')
                    .replace('}', '')
              ) {
                matchKey = key;
              }
              return matchKey;
            });
            if (filterKey) {
              newFilter.value = row[filterKey];
            }
            newFilters.push(newFilter);
          });
        }
        this.gridService.setDropdownData(
          col,
          obj.uniqueKey,
          obj.valueProp,
          obj.labelProp,
          newFilters,
          row
        );

        let option = col.data.find(
          (x) => x.label === row[col.field]?.toString()
        );
        if (option) {
          row[col.field] = option.value;
        }
      }
    }
  }

  setFormat(column: any, row: any) {
    let value: string = '';
    if (column.format) {
      value = this.datePipe.transform(
        column.displayText ? column.displayText : row[column.field],
        column.format
      );
    } else {
      value = column.displayText ? column.displayText : row[column.field];
    }
    return value;
  }

  /**
   *
   * @param row
   * Passes the edited or newly created data to parent
   * In case of newly created data, dataKey and isNew prop is removed
   */
  onRowEditSave(selectedRow: any) {
    this.selectedColumns.forEach((column) => {
      delete selectedRow[column.field + '-data'];
      delete selectedRow[column.field + '_secondType'];
      if (
        column.type === EGridColumnType.LOOKUP_INPUT &&
        column.displayField &&
        this.lookupObject
      ) {
        selectedRow[column.field] = this.lookupObject.value;
      }

      if (column.formatter) {
        let value: any = selectedRow[column.field];
        if (column.formatter === 'char') {
          value = value === true ? 'Y' : 'N';
        } else if (column.formatter === 'numeric') {
          value = value === true ? '1' : '0';
        }
        selectedRow = { ...selectedRow, [column.field]: value };
      }

      // Saving AutoComplete Data
      if (column.type === EGridColumnType.AUTOCOMPLETE && column.value) {
        this.rowsData.forEach((x) => {
          if (x.id === selectedRow.id) {
            x['displayValue'] = column.value;
          }
        });
        let field = Object.keys(selectedRow).find(
          (key) => key === column.field
        );
        if (field) {
          let obj = { ...selectedRow, [column.field]: column.value };
          delete obj.displayValue;
          selectedRow = { ...obj };
        }
      }
    });

    let row: any = { ...selectedRow };
    let keys = Object.keys(row);
    keys.forEach((key) => {
      if (this.lookupObject && this.lookupObject.field) {
        row[this.lookupObject.field] = this.lookupObject.value;
      }
      if (key.includes('_obj')) {
        if (this.checkAction === false) {
          row = { ...row, [key.split('_')[0]]: row[key].displayText };
          this.checkAction = true;
        }
        let obj: any = row[key];
        if (
          obj &&
          (obj.type === 'link' ||
            obj.type === 'iframe' ||
            obj.type === 'dialog')
        ) {
          delete row[key];
        }
      }
    });
    /**
     * just emit those fields who exist in the tabel
     */
    let obj: any = {};
    this.columns.forEach((column: any) => {
      if (column.allowSave === true || column.allowSave === undefined) {
        obj[column.field] = row[column.field];
        if (
          column.type === EGridColumnType.DIALOG &&
          column.filter.type === 'calendar'
        ) {
          obj[column.field] = this.datePipe.transform(
            obj[column.field],
            'yyyy-MM-ddT00:00:00.000Z'
          );
        }

        // Edit Link on column & saving the updated Link
        if (column.type === EGridColumnType.LINK) {
          obj[column.field] = selectedRow[column.field + '_obj']?.hyperlink;
        }
      }
    });
    this.gridService.checkValidity(this.columns, row);
    const isValid = this.gridValidation(this.columns, row);
    if (isValid) {
      if (row.isNew) {
        const { isNew, ...newRowObj } = row;
        delete newRowObj[this.dataKey];
        this.onRowAdd.emit(newRowObj);
      } else {
        this.onRowUpdate.emit(obj);
      }
      this.editingRowKeys[row[this.dataKey]] = false;
    } else {
      this.editingRowKeys[row[this.dataKey]] = true;
    }
  }

  gridValidation(columns, row): boolean {
    if (!this.gridService.checkValidity(columns, row)) {
      let isRequired = columns.some(
        (column) => column.errorMessage && !row[column.field]
      );
      if (isRequired) {
        this.alertService.error(
          'Required fields are missing',
          'REQUIRED FIELD'
        );
      } else {
        this.alertService.error('Some fields are invalid', 'INVALID FIELD');
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   *
   * @param row : any
   * @param index : number
   * Clears out the edit row and replace with readable one
   */
  onRowEditCancel(row: any, index: number) {
    if (row.isNew) {
      this.rowsData.splice(index, 1);
    } else {
      this.rowsData[index] = this.editRowsRecords[row[this.dataKey]];
      delete this.editRowsRecords[row[this.dataKey]];
    }
    delete this.editingRowKeys[row[this.dataKey]];
    this.inlineRowCancel.emit(row);
  }

  /**
   *
   * @param row
   * Sends the row payload to parent for deletion
   */

  /**
   * open Delete confirmation dialog when trying to delete row
   */
  deleteRecord(row) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'handleInlineCRUD',
      accept: () => {
        if (this.useServerSideEvents) {
          this.loading = true;
        }
        this.onRowDelete.emit(row);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  /**
   * To set aggregate in grid footer
   */
  setAggregateText(column: IGridColumn) {
    if (column?.aggregate) {
      column.aggregate.forEach((col: any) => {
        let columnType: EGridAggregate = col.type;
        if (columnType === EGridAggregate.COUNT) {
          const count = this.rowsData.length;
          col.aggrValue = this.setAggregateFooterText(col, count, 'Count');
        }

        if (
          columnType === EGridAggregate.SUM ||
          columnType === EGridAggregate.AVERAGE
        ) {
          const colValues: number[] = this.getColumnValues(column);
          if (colValues && colValues.length > 0) {
            const sum = colValues.reduce((acc, cur) => acc + cur, 0);
            if (columnType === EGridAggregate.SUM) {
              col.aggrValue = this.setAggregateFooterText(col, sum, 'Sum');
            }
            if (columnType === EGridAggregate.AVERAGE) {
              const average = sum / colValues.length || 0;
              col.aggrValue = this.setAggregateFooterText(col, average, 'Avg');
            }
          }
        }
      });
    }
  }

  /**
   * set grid Aggregate values
   */
  setAggregateFooterText(column: any, value: number, defaultCaption: string) {
    const isDecimalFormat: boolean = column.format?.type === 'decimal';
    const digitsInfo = column.format?.digitsInfo;
    const caption: string =
      column.caption?.length > 0 ? column.caption : defaultCaption;

    const decimalPoint = isDecimalFormat
      ? value?.toFixed(digitsInfo ? digitsInfo : 2)
      : value?.toFixed(0);
    return `${caption} ${decimalPoint
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </br>`;
  }

  /**
   * get column value based on column field
   */
  getColumnValues(column: IGridColumn) {
    let arr = [];
    this.rowsData.forEach((row) => {
      let keys = Object.keys(row);
      keys.map((key) => {
        if (column.field === key) {
          arr.push(row[key]);
        }
      });
    });
    return arr;
  }

  /**
   *
   * Export to PDF
   */
  exportPdf() {
    var exportData = this.setExportData([...this.rowsData], true);
    let doc = new jsPDF('p', 'pt');
    doc.table(1, 1, exportData.rows, exportData.headings, { autoSize: true });
    doc.save('Export.pdf');
  }

  /**
   *  Sub-function to set rows for export to Pdf, and Excel
   * @rows param for rows
   * @isExcel param for export to excel indication
   */
  setExportData(rows: any[] = [], isPdf: boolean = false): IGridDataExport {
    const headings = this.columns.map((column) => column.field);
    rows.forEach((row) => {
      for (var prop in row) {
        if (!headings.includes(prop)) {
          delete row[prop];
        }
        if (isPdf) {
          row[prop] =
            !row[prop] && typeof row[prop] !== 'boolean'
              ? ''
              : row[prop].toString();
        }
      }
    });
    return { rows, headings };
  }

  /**
   *
   * Export to Excel
   */
  exportExcel() {
    let exportData: any = this.exportDataToExcel();
    import('xlsx').then((xlsx) => {
      const worksheet: WorkSheet = xlsx.utils.json_to_sheet(exportData);

      let rowIndex = 0;
      exportData.forEach((row: any) => {
        let colIndex = 0;
        this.selectedColumns.forEach((col: any) => {
          const cellValue: string = row[col.header];
          if (cellValue && cellValue.length > 0 && cellValue.indexOf('|') > 0) {
            const linkText: string = cellValue.split('|')[0];
            let linkUrl: string = cellValue.split('|')[1];
            if (linkUrl && !linkUrl.startsWith('http')) {
              if (!linkUrl.startsWith('/')) {
                linkUrl = '/' + linkUrl;
              }

              linkUrl =
                window.location.protocol +
                '//' +
                window.location.hostname +
                linkUrl;
            }

            const cellAddress = xlsx.utils.encode_cell({
              c: colIndex,
              r: rowIndex + 1,
            });

            worksheet[cellAddress] = {
              f: `=HYPERLINK("${linkUrl}", "${linkText}")`,
            };
          }

          colIndex++;
        });

        rowIndex++;
      });

      const workbook = {
        Sheets: { sheet1: worksheet },
        SheetNames: ['sheet1'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Export.xlsx');
    });
  }

  exportDataToExcel() {
    let arr: any = [];
    this.rowsData.forEach((row: any) => {
      let obj = {};
      this.selectedColumns.forEach((column: any) => {
        const gridHeader = column.header;
        if (column.type === EGridColumnType.LINK) {
          const linkObj = row[column.displayText?.toLowerCase() + '_obj'];
          obj[gridHeader] = row[column.field] + '|' + linkObj?.hyperlink;
        } else {
          obj[gridHeader] = row[column.field];
        }
      });

      arr.push(obj);
    });
    return arr;
  }

  /**
   *
   * Export to excel (sub-method)
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      saveAs(data, fileName);
    });
  }

  /**
   * open dialog on lookupControl field
   */
  selectLookupField(column: IGridColumn, row?: any) {
    this.lookupObject = { text: '', value: '', field: '' };
    let selection: string = '';
    if (row[column.field] && typeof row[column.field] === 'object') {
      selection = row[column.field].text;
    } else if (column.displayField && row[column.displayField]) {
      selection = row[column.displayField];
    } else {
      selection = row[column.field];
    }

    if (
      column.type === EGridColumnType.LOOKUP_INPUT &&
      column.lookupControl.data?.data
    ) {
      let obj = utilities.autoSetLookupData(
        column.lookupControl.data?.data,
        row
      );
      row[column.field + '-data'] = obj;
    }

    if (column.lookupControl) {
      const ref = this.dialogService.open(column.lookupControl.component, {
        ...column.lookupControl.data,
        data: {
          selection: selection,
          field: column.field,
          valueField: column.lookupControl.data.valueField,
          ...row[column.field + '-data'],
        },
      });

      ref.onClose.subscribe(
        (res) => {
          if (column.onReturn) {
            column.onReturn(res, row);
          }
          if (res) {
            let value = utilities.setDialogResponse(
              column,
              column.lookupControl,
              res
            );
            if (column.displayField) {
              row[column.field] = {
                text: res[column.displayField.toLowerCase()],
                value: res[column.field.toLowerCase()],
              };
              this.lookupObject = row[column.field];
            } else if (value && value.value) {
              value['field'] = column.field;
              row[column.field] = value.value;
            } else {
              row[column.field] = res[column.field.toLowerCase()];
            }
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
          delete row[column.field + '-data'];
        }
      );
    }
  }

  setFilterLookup(column) {
    this.gridService.setLookUpFilter(column, this.dialogService);
  }

  onFocusOutEvent(column: IGridColumn, row: any) {
    this.gridService.checkValidity([column], row);
    if (column.onFocusOut) {
      column.onFocusOut(row);
    } else if (
      column.onReturn &&
      column.type !== EGridColumnType.LOOKUP_INPUT
    ) {
      column.onReturn(row);
    }
  }

  setFilterFocusOut(col: any) {
    const newColumn: any = { ...col };
    if (newColumn.type === 'date' && newColumn.value) {
      newColumn.value = this.datePipe.transform(
        col.value.toString().trim(),
        'yyyy-MM-dd'
      );
    }
    setTimeout(
      () => {
        this.filterObj(newColumn);
      },
      newColumn.type === EGridColumnType.LOOKUP_INPUT ? 250 : 0
    );
    localStorage.setItem('applyFilter', JSON.stringify(false));
  }

  filterObj(col) {
    const obj = {
      field: col.field,
      matchMode: col.matchMode ? col.matchMode : 'startsWith',
      operator: col.operator ? col.operator : 'and',
      tableAlias: col.tableAlias ? col.tableAlias : '',
      value: col.value,
    };

    this.globalFiltersArray.push(obj);
  }

  applyEnterEvent(filter, event, column: any) {
    this.filterObj(column);
    localStorage.setItem('applyFilter', JSON.stringify(true));
    filter(event.target.value);
  }

  backspaceEvent(event, column) {
    if (
      event.key === 'Backspace' &&
      (column.value.toString().length === 1 || column.value.toString() === '')
    ) {
      if (this.globalFiltersArray && this.globalFiltersArray.length > 0) {
        let arr = [...this.globalFiltersArray];
        let index = arr.findIndex((i) => i.field === column.field);
        arr.splice(index, 1);
        this.globalFiltersArray = arr;
      }
    }
  }

  // Removing Header Filter Value using Backspace key Event or Delete key Event.
  removingFilters(event: any, column: IGridColumn) {
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      column.value.toString().length === 0
    ) {
      let searchFilters = JSON.parse(
        localStorage.getItem('SetFilters-' + utilities.currentUrl()) as any
      );
      if (searchFilters && searchFilters.filters) {
        if (searchFilters.filters.length > 0) {
          let index = searchFilters.filters.findIndex(
            (x: any) => x.field === column.field
          );
          if (index !== -1) {
            if (searchFilters.filters.length === 1) {
              localStorage.removeItem('SetFilters-' + utilities.currentUrl());
            } else {
              searchFilters.filters.splice(index, 1);
              localStorage.setItem(
                'SetFilters-' + utilities.currentUrl(),
                JSON.stringify(searchFilters)
              );
            }
          }
        }
      }
    }
  }

  // Add Click Button Event on Grid.
  onClickButton(column: any, row: any) {
    this.openGridDialog(column);
    if (column && column.onClick) {
      column.onClick(row);
    }
  }

  // Add autoSearch on Grid.
  autoSearch(event: any, column: IGridColumn) {
    if (event && column) {
      column.onReturn(event.query, column);
    }
  }
}
