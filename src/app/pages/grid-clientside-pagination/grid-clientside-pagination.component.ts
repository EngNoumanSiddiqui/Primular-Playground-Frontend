import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  EGridColumnType,
  GridFilterControlType,
  IGridFilter,
  IGridPaginationEvent,
  IGridServerSideEvent,
  ISelectItem,
  RequestDto,
} from '@churchillliving/se-ui-toolkit';
import { UserData } from '../../models/user.model';
import { AlertService, RequestService } from '@churchillliving/se-ui-toolkit';
import { IGridColumn } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-grid-clientside-pagination',
  templateUrl: './grid-clientside-pagination.component.html',
})
export class GridclientsidepaginationComponent implements OnInit {
  public users: UserData[] = [];
  public totalRecords: number;
  value: boolean;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public lookUpColumns: IGridColumn[] = [];
  public hasExternalCols: boolean = false;
  age: any;

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private changeRef2: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.initializeFilters();
    console.log('*value received:', this.age);
  }

  /**
   * Sets lookup filter values
   */
  initializeFilters() {
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

    // if (!this.hasExternalCols) {
    this.lookUpColumns = [
      {
        field: 'CId',
        header: 'Id',
        filter: { type: GridFilterControlType.INPUT },
        filtering: false,
      },
      {
        field: 'CFirstName',
        header: 'FirstName',
        filter: {
          type: GridFilterControlType.DROPDOWN,
          data: this.dropdownData,
        },
        filtering: false,
      },
      {
        field: 'LastName',
        header: 'LastName111',
        filter: { type: GridFilterControlType.INPUT },
        filtering: false,
        hidden: this.value,
      },
      {
        field: 'Age',
        header: 'Age',
        type: EGridColumnType.NUMERIC,
        filter: {
          type: GridFilterControlType.MULTISELECT,
          data: this.multiSelectData,
        },
        filtering: false,
      },
      {
        field: 'CreatedDate',
        header: 'CreatedDate',
        type: EGridColumnType.DATE,
        filter: { type: GridFilterControlType.CALENDAR },
        filtering: false,
        format: 'MM-dd-YY', // reference: https://angular.io/api/common/DatePipe
      },
      {
        field: 'Active',
        header: 'Active',
        type: EGridColumnType.BOOLEAN,
        filter: { type: GridFilterControlType.CHECKBOX },
        filtering: false,
      },
    ];
    // }
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
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Customer-Query-SelectAll',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  handleRowClick(data: any) {
    console.log('Row Data', data);
  }

  handleSortChange(data: any) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
  }

  handlePagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
