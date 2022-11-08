import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Optional,
} from '@angular/core';
import {
  EDayRange,
  EGridColumnType,
  GridFilterControlType,
  IGlobalFilter,
  IGridColumn,
  IGridFilter,
  IGridPaginationEvent,
  IGridServerSideEvent,
  ISelectItem,
} from '../../models';
import { UserData } from '../../models/user.model';
import { AlertService } from '../../services/alert.service';
import { RequestService } from '../../services/request.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GridService } from '../../services/grid.service';
import * as utilities from '../../services/utilities.service';
import { RequestDto } from '@churchillliving/se-ui-toolkit';
import { SelectionComponent } from '../grid-selection/selection.component';

@Component({
  selector: 'app-grid-global-filters',
  templateUrl: './grid-global-filters.component.html',
  styleUrls: ['./grid-global-filters.component.scss'],
})
export class GridGlobalFiltersComponent implements OnInit {
  setValue: any = 'globel-test';
  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public lookUpColumns: IGridColumn[] = [];
  public globalFilters: IGlobalFilter[] = [];
  public hasExternalCols: boolean = false;

  @Output() onServerSideChange = new EventEmitter<string>();

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private gridService: GridService,
    @Optional() public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef
  ) {}

  data: any;
  globalFilterData: IGlobalFilter[] = [];

  ngOnInit(): void {
    if (this.config?.data) {
      console.log('data passed from sidebar:', this.config.data.value);
    }
    this.users = [];
    this.initializeLookupFilters();
    this.initializeGlobalFilters().then((res) => {
      console.log('globalFilters:', this.globalFilters);
    });
  }

  /**
   * Sets global filter values
   */
  async initializeGlobalFilters() {
    let __this = this;
    let streetNum1 = await this.gridService.addGlobalDropdownFilter(
      {
        field: 'StreetNumber',
        displayText: 'Street Number 1',
        allowSearch: true,
        optionLabel: 'value',
        optionValue: 'label',
        column: '3',
        disabled: false,
        hidden: false,
        value: '',
        onFocusOut: function (globalFilter: IGlobalFilter) {
          console.log('StreetNumber', globalFilter);
          __this.getFilterValue();
        },
        // onFocusOut: function (globalFilter: IGlobalFilter) {
        //   if (globalFilter.value) {
        //     let obj = utilities.getGlobalFilters(
        //       __this.globalFilters,
        //       'StreetNumber2'
        //     );
        //     __this.gridService.getDropdownData(
        //       obj,
        //       'Customer-GetStreetNumbers-StoredProcedure',
        //       'ID',
        //       'StREEtNUmber',
        //       [utilities.setAndFilter('CID', globalFilter.value)]
        //     );
        //   }
        // },
      },
      {
        uniqueKey: 'Customer-GetStreetNumbers-StoredProcedure',
        valueProp: 'ID',
        labelProp: 'StREEtNUmber',
        filters: [],
      }
    );

    let streetNum2 = await this.gridService.addGlobalDropdownFilter({
      field: 'StreetNumber2',
      displayText: 'Street Number 2',
      optionLabel: 'value',
      optionValue: 'label',
      disabled: false,
      hidden: false,
      column: '3',
    });

    this.globalFilters = [
      this.gridService.addGlobalFilter({
        field: 'ModifiedDate',
        displayText: 'Modified Date',
        type: GridFilterControlType.CALENDAR,
        data: null,
        matchMode: null,
        operator: null,
        column: '3',
        // tableAlias: 'ss',
        disabled: false,
        hidden: false,
        value: '',
        onFocusOut: function (globalFilter: IGlobalFilter) {
          console.log('ModifiedDate', globalFilter);
          __this.getFilterValue();
        },
      }),
      // {
      //   field: 'ModifiedDate',
      //   displayText: 'Modified Date',
      //   type: GridFilterControlType.CALENDAR,
      //   data: null,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      //   column: '3',
      //   // tableAlias: 'ss',
      //   disabled: false,
      //   hidden: false,
      // },
      // {
      //   field: 'ModifiedDate',
      //   displayText: 'Calendar Weeks',
      //   type: GridFilterControlType.CALENDAR_RANGE,
      //   column: '6',
      //   //format:'dd.mm.yy',
      // },
      this.gridService.addRangeFilter({
        displayText: 'Calendar Weeks',
        type: GridFilterControlType.CALENDAR_RANGE,
        dayRange: EDayRange.WEEK,
        fromDateField: 'CreatedDate',
        toDateField: 'CreatedDate',
        value: '2022/4/25',
        column: '6',
        disabled: false,
        hidden: false,
        //color: '#cc7272',
      }),
      streetNum1,
      streetNum2,
      // {
      //   field: 'StreetNumber',
      //   displayText: 'Street Number',
      //   type: GridFilterControlType.DROPDOWN,
      //   data: this.filterData,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      // },
      this.gridService.addGlobalLookupFilter({
        field: 'LASTname',
        displayText: 'First Name',
        disabled: false,
        hidden: false,
        column: '3',
        lookupControl: {
          component: SelectionComponent,
          data: {
            header: 'Grid selection',
            width: '80%',
            data: { firstname: 'test', lastname: 'test111' },
          },
        },
        onFocusOut: function (globalFilter: IGlobalFilter) {
          console.log('First Name', globalFilter);
          __this.getFilterValue();
        },
      }),
      this.gridService.addGlobalBooleanFilter({
        field: 'HasOrders',
        displayText: 'Has Orders',
        data: null,
        matchMode: null,
        operator: null,
        column: '3',
        disabled: false,
        hidden: false,
        value: null,
        onFocusOut: function (globalFilter: IGlobalFilter) {
          console.log('HasOrders: ', globalFilter);
          __this.getFilterValue();
        },
      }),
      // {
      //   field: 'HasOrders',
      //   displayText: 'Has Orders',
      //   type: GridFilterControlType.CHECKBOX,
      //   data: null,
      //   value: null,
      //   matchMode: null,
      //   operator: null,
      //   column: '3',
      //   disabled: false,
      //   hidden: false,
      // },
      this.gridService.addGlobalInputFilter({
        field: 'TotalOrders',
        displayText: 'Total Orders',
        value: '',
        matchMode: null,
        operator: null,
        column: '3',
        disabled: false,
        hidden: false,
        onFocusOut: function (globalFilter: IGlobalFilter) {
          console.log('TotalOrders: ', globalFilter);
          __this.getFilterValue();
        },
      }),
      // {
      //   field: 'TotalOrders',
      //   displayText: 'Total Orders',
      //   type: GridFilterControlType.INPUT,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      //   column: '3',
      //   disabled: false,
      //   hidden: false,
      //   onFocusOut: function (globalFilter: IGlobalFilter) {
      //     __this.getFilterValue();
      //   },
      // },
      {
        field: 'Email',
        displayText: 'Email',
        type: GridFilterControlType.INPUT,
        data: null,
        value: '',
        matchMode: '',
        operator: null,
        column: '3',
        disabled: false,
        hidden: false,
        onFocusOut: function (globalFilter: IGlobalFilter) {},
      },
    ];
  }

  /**
   * Sets lookup filter values
   */
  initializeLookupFilters() {
    this.multiSelectData = [
      { label: '20', value: '20' },
      { label: '33', value: '33' },
      { label: '30', value: '30' },
      { label: '45', value: '45' },
    ];

    this.dropdownData = [
      { label: 'User One', value: 'User One' },
      { label: 'User Three', value: 'User Three' },
    ];

    if (!this.hasExternalCols) {
      this.lookUpColumns = [
        {
          field: 'CId',
          header: 'Id',
          filter: { type: GridFilterControlType.INPUT },
          // tableAlias: 'id',
        },
        this.gridService.addLookUpColumn({
          field: 'CFirstName',
          header: 'Sales Rep',
          filtering: true,
          lookupControl: {
            component: SelectionComponent,
            data: {
              header: 'Grid selection',
              width: '40%',
              data: {},
            },
          },
        }),

        {
          field: 'LastName',
          header: 'LastName',
          // tableAlias: 'lastname',
          filter: { type: GridFilterControlType.INPUT },
        },
        {
          field: 'Age',
          header: 'Age',
          type: EGridColumnType.NUMERIC,
          filter: {
            type: GridFilterControlType.INPUT,
            // data: this.multiSelectData,
          },
        },
        {
          field: 'CreatedDate',
          header: 'CreatedDate',
          type: EGridColumnType.DATE,
          filter: { type: GridFilterControlType.CALENDAR },
          format: 'MM-dd-YY', // reference: https://angular.io/api/common/DatePipe
        },
        {
          field: 'Active',
          header: 'Active',
          type: EGridColumnType.BOOLEAN,
          filter: { type: GridFilterControlType.CHECKBOX },
        },
      ];
    }
  }

  getFilterValue() {
    utilities.setGlobalFilterPropValues(this.globalFilters, 'Email', [
      { propName: 'value', propValue: 'test12345' },
      { propName: 'disabled', propValue: true },
    ]);
  }

  getUsers(request: IGridServerSideEvent = {}) {
    this.getUsersData(request).subscribe(
      (response) => {
        this.users = response.records;
        this.totalRecords = response.totalRecords;
        this.onServerSideChange.emit('New Data Received');
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.users = [];
        this.totalRecords = 0;
        this.onServerSideChange.emit('Data Fetch Failed');
      }
    );
  }

  getUsersData(request: IGridServerSideEvent) {
    request.filters.forEach((item) => {
      if (typeof item.value === 'boolean') {
        item.value = item.value ? 1 : 0;
      }
    });

    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Customer-Query-SelectAll',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  globalFiltersApplied(globalFilterData: IGlobalFilter[]) {
    this.globalFilterData = [...globalFilterData];
  }

  handleRowClick(data: any) {
    console.log('Row Data', data);
    this.ref.close(data);
  }

  handleSortChange(data: any) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.getUsers(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
