import { Component, OnInit } from '@angular/core';
import {
  GridFilterControlType,
  IGridServerSideEvent,
  IGridPaginationEvent,
  IGridFilter,
  IGridColumn,
  RequestDto,
  RequestService,
  AlertService,
} from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
})
export class CompanyListComponent implements OnInit {
  public companys: any[] = [];
  public loading = false;
  public totalRecords: number;
  public UserId = '123';

  public columns: IGridColumn[] = [
    {
      field: 'ACCOUNTNAME',
      header: 'Company',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'ADDRESS1',
      header: 'Address',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'City',
      header: 'City',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'State',
      header: 'State',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'Zip',
      header: 'Zip',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'MAINPHONE',
      header: 'Phone',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'AccountId',
      header: 'Company Id',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'NumOfLeads',
      header: '# of Leads',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'UserId',
      header: 'UserId',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
      hidden: true,
    },
  ];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {}

  getCompanies(request: IGridServerSideEvent = {}) {
    this.getCompaniesData(request).subscribe(
      (response) => {
        this.companys = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.companys = [];
        this.totalRecords = 0;
      }
    );
  }

  getCompaniesData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Company-Query-SelectAll',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  handleRowClick(data) {
    console.log('Row Data', data);
  }

  handleSortChange(data) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }
  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.getCompanies(filter);
  }
  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
