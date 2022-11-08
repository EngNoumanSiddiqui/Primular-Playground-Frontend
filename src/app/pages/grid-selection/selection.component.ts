import { Component, OnInit, Optional } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  EGridColumnType,
  GridFilterControlType,
  IGridFilter,
  IGridPaginationEvent,
  IGlobalFilter,
  RequestDto,
} from '../../models';
import { UserData } from '../../models/user.model';
import { GridService } from '../../services/grid.service';
import {
  EGridSelectionType,
  IGridRowAction,
  IGridServerSideEvent,
  ISelectItem,
} from '@churchillliving/se-ui-toolkit';
import * as utilities from '../../services/utilities.service';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';
import { IGridColumn } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'selection-component',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {
  gridSelectionType: EGridSelectionType = EGridSelectionType.SINGLE;

  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public lookUpColumns: IGridColumn[] = [];
  public globalFilters: IGlobalFilter[] = [];
  public selectedRows = undefined;
  public scroll: boolean = true;
  public firstNameFilterValue: any;
  public selectedValue: any;
  public selectedKey: any;

  constructor(
    private requestService: RequestService,
    private gridService: GridService,
    private alertService: AlertService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private route: ActivatedRoute
  ) {}

  rowActions: IGridRowAction[] = [
    {
      title: 'Select',
      class: 'p-button-success mx-2',
      onClick: (selectedRows: any) => {
        console.log('select event invoked');
        this.selectedRows = selectedRows;
        this.ref.close(selectedRows);
      },
    },
    {
      title: 'Cancel',
      class: 'p-button-danger',
      onClick: (selectedRows: any) => {
        console.log('cancel event invoked');
        this.ref.close();
      },
    },
  ];

  globalFilterData: IGlobalFilter[] = [];

  ngOnInit(): void {
    this.users = [];
    this.initializeLookupFilters();
    this.initializeGlobalFilters();
    if (this.config.data.selection) {
      this.selectedValue = this.config.data.selectedValue;
    }
    this.route.queryParams.subscribe((x) => {
      console.log('X:', x);
    });
    // console.log("X22:",window.opener.value)
  }

  /**
   * Sets global filter values
   */
  initializeGlobalFilters() {
    this.globalFilters = [
      {
        field: 'ModifiedDate',
        displayText: 'Modified Date',
        type: GridFilterControlType.CALENDAR,
        data: null,
        value: '',
        matchMode: null,
        operator: null,
      },
      {
        field: 'HasOrders',
        displayText: 'Has Orders',
        type: GridFilterControlType.CHECKBOX,
        data: null,
        value: null,
        matchMode: null,
        operator: null,
      },
      {
        field: 'TotalOrders',
        displayText: 'Total Orders',
        type: GridFilterControlType.NUMERICINPUT,
        value: '',
        matchMode: null,
        operator: null,
      },
      {
        field: 'Email',
        displayText: 'Email',
        type: GridFilterControlType.INPUT,
        data: null,
        value: '',
        matchMode: '',
        operator: null,
      },
      {
        field: 'StreetNumber',
        displayText: 'Street Number',
        type: GridFilterControlType.MULTISELECT,
        data: [
          { label: '10', value: '10' },
          { label: '210', value: '210' },
          { label: '30', value: '30' },
          { label: '65', value: '65' },
          { label: '88', value: '88' },
          { label: '77', value: '77' },
          { label: '11', value: '11' },
        ],
        value: '',
        matchMode: null,
        operator: null,
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

    this.lookUpColumns = [
      {
        field: 'CId',
        header: 'Id',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'CFirstName',
        header: 'FirstName',
        filter: {
          type: GridFilterControlType.INPUT,
        },
        value: this.firstNameFilterValue,
      },
      {
        field: 'LastName',
        header: 'LastName',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'Age',
        header: 'Age',
        type: EGridColumnType.NUMERIC,
        filter: {
          type: GridFilterControlType.MULTISELECT,
          data: this.multiSelectData,
        },
      },
      {
        field: 'CreatedDate',
        header: 'CreatedDate',
        type: EGridColumnType.DATE,
        filter: { type: GridFilterControlType.CALENDAR },
        format: 'YY-MM-dd hh:mm:ss a', // reference: https://angular.io/api/common/DatePipe
      },
      {
        field: 'Active',
        header: 'Active',
        type: EGridColumnType.BOOLEAN,
        filter: { type: GridFilterControlType.CHECKBOX },
      },
    ];
  }

  getUsers(request: IGridServerSideEvent = {}) {
    this.getUsersData(request).subscribe(
      (response) => {
        this.users = this.gridService.setDataWithSelectedRow(
          response.records,
          this.config
        );
        this.totalRecords = response.totalRecords;
        const matchField: string = utilities.getMatchKey(
          this.users,
          this.config.data.matchField
        );
        this.selectedRows = this.users.find(
          (x) => x[matchField] === this.config.data.selection
        );
        console.log('SELECTED', this.selectedRows);
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.users = [];
        this.totalRecords = 0;
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
    console.log('Row Data:', data);
    this.ref.close(data);
  }

  handleSortChange(data: any) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleScrollChange(value: any) {
    console.log('Scroller Value:', value);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.getUsers(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
