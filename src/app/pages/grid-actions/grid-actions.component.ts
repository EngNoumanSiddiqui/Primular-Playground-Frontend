import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FormComponent } from '../form/form.component';
import {
  EGridColumnType,
  GridFilterControlType,
  IGridFilter,
  IGridPaginationEvent,
  IGridServerSideEvent,
  ISelectItem,
  IGlobalFilter,
  RequestDto,
} from '../../models';
import { UserData } from '../../models/user.model';
import { Router } from '@angular/router';
import { RequestService } from '@churchillliving/se-ui-toolkit';
import { IGridColumn, IGridColumnAction } from 'src/app/models/grid.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-active-grid',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss'],
})
export class ActiveGridComponent implements OnInit {
  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public lookUpColumns: IGridColumn[] = [];
  public globalFilters: IGlobalFilter[] = [];
  public request: IGridServerSideEvent;

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private router: Router,
    public dialogService: DialogService
  ) {}

  // initialize grid actions column
  columnActions: IGridColumnAction[] = [
    {
      icon: 'pi pi-pencil',
      tooltip: 'Edit',
      width: '100px',
      onClick: (data) => {
        console.log('edit event invoked for row data:', data);

        // show edit form, in current tab
        //this.router.navigate(["dynamic-form"], { queryParams: { id: data.Id } });

        // show edit form, in new tab
        //window.open("dynamic-form?id=" + data.Id);

        // show edit page as modal popup
        this.showModalForm(data);
      },
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Delete',
      width: '100px',
      confirmDialog: true,
      onClick: (data) => {
        this.deleteRecord(data);
      },
    },
  ];

  deleteRecord(data) {
    console.log('delete event invoked for row data:', data);
  }

  globalFilterData: IGlobalFilter[] = [];

  ngOnInit(): void {
    this.users = [];
    this.initializeLookupFilters();
    this.initializeGlobalFilters();
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
        filtering: false,
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'CFirstName',
        header: 'FirstName',
        filtering: false,
        filter: {
          type: GridFilterControlType.DROPDOWN,
          data: this.dropdownData,
        },
      },
      {
        field: 'LastName',
        header: 'LastName',
        filtering: false,
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'Age',
        header: 'Age',
        filtering: false,
        type: EGridColumnType.NUMERIC,
        filter: {
          type: GridFilterControlType.MULTISELECT,
          data: this.multiSelectData,
        },
      },
      {
        field: 'CreatedDate',
        header: 'CreatedDate',
        filtering: false,
        type: EGridColumnType.DATE,
        filter: { type: GridFilterControlType.CALENDAR },
        format: 'MM-dd-YY', // reference: https://angular.io/api/common/DatePipe
      },
      {
        field: 'Active',
        header: 'Active',
        filtering: false,
        type: EGridColumnType.BOOLEAN,
        filter: { type: GridFilterControlType.CHECKBOX },
      },
    ];
  }

  getUsers(request: IGridServerSideEvent = {}) {
    this.getUsersData(request).subscribe(
      (response) => {
        this.users = response.records;
        this.totalRecords = response.totalRecords;
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
    console.log('Row Data', data);
    this.router.navigate(['/multi-dynamic-form'], {
      queryParams: { id: data.CId },
    });
  }

  handleSortChange(data: any) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.request = filter;
    this.getUsers(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }

  showModalForm(data: any) {
    // show edit page as modal popup
    const ref = this.dialogService.open(FormComponent, {
      header: 'Edit From',
      width: '70%',
      data: { id: data.CId },
    });

    // capturing modal close event
    ref.onClose.subscribe(
      (res) => {
        console.log('modal close response:', res);
        if (res) {
          // in case of modal closed via save button, fetch data again from api
          this.getUsers(this.request);
        } else {
          console.log('modal is closed via cancel button.');
        }
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }
}
