import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import {
  GridFilterControlType,
  IGridServerSideEvent,
  IGridPaginationEvent,
  IGlobalFilter,
  IGridFilter,
  IGridColumn,
  RequestDto,
} from '@churchillliving/se-ui-toolkit';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
})
export class LeadListComponent implements OnInit {
  public leads: any[] = [];
  public loading = false;

  public totalRecords: number;

  public columns: IGridColumn[] = [
    {
      field: 'LfOpportId',
      header: 'Proposal Id',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'AccountNum',
      header: 'Account #',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'LastName',
      header: 'Last Name',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'LeaseStartDate',
      header: 'Lease Start',
      filter: { type: GridFilterControlType.INPUT },
      filtering: true,
    },
    {
      field: 'SalesRepId',
      header: 'Sales Rep',
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
      field: 'prob',
      header: 'Is Booked',
      filter: { type: GridFilterControlType.CHECKBOX },
      filtering: true,
    },
  ];

  public globalFilters: IGlobalFilter[] = [
    {
      field: 'LeadCreatedDate',
      displayText: 'Lead Created Date',
      type: GridFilterControlType.CALENDAR,
      data: null,
      value: '',
      matchMode: null,
      operator: null,
    },
    {
      field: 'prob',
      displayText: 'Is Booked',
      type: GridFilterControlType.CHECKBOX,
      data: null,
      value: false,
      matchMode: null,
      operator: null,
    },
    {
      field: 'LeadStatus',
      displayText: 'Lead Status',
      type: GridFilterControlType.DROPDOWN,
      data: [
        { label: 'Bill Change', value: 'BILLCHANGE' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Current', value: 'CURRENT' },
        { label: 'Moving In', value: 'MOVING IN ' },
      ],
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
      matchMode: null,
      operator: null,
    },
    {
      field: 'AccountId',
      displayText: 'Company',
      type: GridFilterControlType.MULTISELECT,
      data: [
        { label: 'Booking.com - Global', value: '000000066190' },
        { label: 'Expedia - Global', value: '000000066191' },
        { label: 'TravelTripper', value: '000000063271' },
        { label: 'Churchill Hotel', value: '000000019572' },
        { label: 'Nomad Corporate Housing', value: '000000055383' },
      ],
      value: '',
      matchMode: null,
      operator: null,
    },
  ];
  bedrooms: any[];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService
  ) {}

  globalFilterData: IGlobalFilter[] = [];

  ngOnInit(): void {
    // this.getLeadss();
    console.log('leads data', this.leads, 'and', this.totalRecords);
  }

  getLeads(request: IGridServerSideEvent = {}) {
    this.getLeadsData(request).subscribe(
      (response) => {
        this.leads = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.leads = [];
        this.totalRecords = 0;
      }
    );
  }

  getLeadsData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Lead-Query-SelectView',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  globalFiltersApplied(globalFilterData: IGlobalFilter[]) {
    this.globalFilterData = [...globalFilterData];
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
    this.getLeads(filter);
  }
  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
