import { Component, OnInit, Optional } from '@angular/core';
import {
  EGridColumnType,
  GridFilterControlType,
  IGridFilter,
  IGridPaginationEvent,
  IGridServerSideEvent,
  ISelectItem,
  RequestDto,
} from '../../models';
import { UserData } from '../../models/user.model';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';
import { IGridColumn } from 'src/app/models/grid.model';
import { GridService } from 'src/app/services/grid.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-grid-pagination',
  templateUrl: './grid-pagination.component.html',
})
export class GridpaginationComponent implements OnInit {
  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public lookUpColumns: IGridColumn[] = [];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private gridService: GridService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.users = [];
    this.initializeFilters();
    // console.log('passed codeType data:', this.config.data);
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
      { label: 'Test10', value: 'Test10' },
      { label: 'Tes14', value: 'Tes14' },
    ];

    this.lookUpColumns = [
      {
        field: 'Id',
        header: 'Id',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'FirstName',
        header: 'FirstName',
        filter: {
          type: GridFilterControlType.DROPDOWN,
          data: this.dropdownData,
        },
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
      // {
      //   field: 'CreatedDate',
      //   header: 'CreatedDate',
      //   type: EGridColumnType.DATE,
      //   filter: { type: GridFilterControlType.CALENDAR },
      //   format: 'MM-dd-YY', // reference: https://angular.io/api/common/DatePipe
      // },
      this.gridService.addDateColumn({
        field: 'CreatedDate',
        header: 'CreatedDate',
        filtering: true,
        format: 'MM/dd/YY',
      }),
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
        this.users = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }

  getUsersData(request: IGridServerSideEvent) {
    console.log('request.filters: ', request.filters);
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Customer-Query-SelectSelectedColumnsWithoutAliases',
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
    this.getUsers(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
