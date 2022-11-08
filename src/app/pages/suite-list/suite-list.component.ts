import { Component, OnInit } from '@angular/core';
import {
  IGridServerSideEvent,
  IGridPaginationEvent,
  IGlobalFilter,
  IGridColumn,
  IGridFilter,
  RequestDto,
} from '@churchillliving/se-ui-toolkit';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';
import { DialogService } from 'primeng/dynamicdialog';
import { SuiteDetailComponent } from '../suite-detail/suite-detail.component';
import { Router } from '@angular/router';
import { GridService } from '@churchillliving/se-ui-toolkit';
@Component({
  selector: 'app-suite-list',
  templateUrl: './suite-list.component.html',
  styles: [],
})
export class SuiteListComponent implements OnInit {
  public suites: any[] = [];
  public loading = false;
  public totalRecords: number;
  public globalFilters: any[] = [];
  globalFilterData: IGlobalFilter[] | [];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private router: Router,
    public dialogService: DialogService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.initializeGlobalFilters();
    console.log('suites data', this.suites, 'and', this.totalRecords);
  }

  filterData = [
    { label: 'Current', value: 'CU' },
    { label: 'Not Current', value: 'N' },
    { label: 'Not Ready', value: 'H' },
    { label: 'Local Office', value: 'LO' },
  ];

  public columns: IGridColumn[] = [
    // {
    //   field: 'SuitId',
    //   header: 'Unit #',
    //   filter: { type: GridFilterControlType.INPUT },
    //   filtering: true,
    // },
    // this.gridService.addInputColumn({field:'SuitId', header:'Unit #', filtering:true}),
    this.gridService.addInputColumn({
      field: 'SuitId',
      header: 'Unit #',
      filtering: true,
    }),
    // {
    //   field: 'BldgId',
    //   header: 'Building Id',
    //   filtering: false,
    //   hidden: true,
    // },
    this.gridService.addFilterColumn({
      field: 'BldgId',
      header: 'Building Id',
      filtering: false,
      hidden: true,
    }),
    // {
    //   field: 'SuiteNo',
    //   header: 'Apt #',
    //   filter: { type: GridFilterControlType.INPUT },
    //   filtering: true,
    // },
    this.gridService.addInputColumn({
      field: 'SuiteNo',
      header: 'Apt #',
      filtering: true,
    }),
    // {
    //   field: 'BuildingName',
    //   header: 'Building Name',
    //   filter: { type: GridFilterControlType.INPUT },
    //   filtering: true,
    // },
    this.gridService.addInputColumn({
      field: 'BuildingName',
      header: 'Building Name',
      filtering: true,
    }),
    // {
    //   field: 'Address1',
    //   header: 'Address',
    //   filter: { type: GridFilterControlType.INPUT },
    //   filtering: true,
    // },
    this.gridService.addInputColumn({
      field: 'Address1',
      header: 'Address',
      filtering: true,
    }),
    // {
    //   field: 'PhoneNo',
    //   header: 'Phone #',
    //   filter: { type: GridFilterControlType.INPUT },
    //   filtering: true,
    // },
    this.gridService.addInputColumn({
      field: 'PhoneNo',
      header: 'Phone #',
      filtering: true,
    }),
    // {
    //   field: 'SuitSize',
    //   header: 'Size',
    //   //filter: { type: GridFilterControlType.INPUT },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'SuitSize',
      header: 'Size',
      filtering: false,
    }),
    // {
    //   field: 'Baths',
    //   header: 'Baths',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'Baths',
      header: 'Baths',
      filtering: false,
    }),
    // {
    //   field: 'AvailStatus',
    //   header: 'Available Status',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'AvailStatus',
      header: 'Available Status',
      filtering: false,
    }),
    // {
    //   field: 'UnitStatus',
    //   header: 'Unit Status',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'UnitStatus',
      header: 'Unit Status',
      filtering: false,
    }),
    // {
    //   field: 'DateAvail',
    //   header: 'Date Avail',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'DateAvail',
      header: 'Date Avail',
      filtering: false,
    }),
    // {
    //   field: 'Reason',
    //   header: 'Reason',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'Reason',
      header: 'Reason',
      filtering: false,
    }),
    // {
    //   field: 'LeaseStart',
    //   header: 'Lease Start',
    //   type: EGridColumnType.DATE,
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    //   format: 'MM/dd/YY',
    // },
    this.gridService.addDateColumn({
      field: 'LeaseStart',
      header: 'Lease Start',
      filtering: false,
      format: 'MM/dd/YY',
    }),
    // {
    //   field: 'UnitEnd',
    //   header: 'Lease End',
    //   type: EGridColumnType.DATE,
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    //   format: 'MM/dd/YY',
    // },
    this.gridService.addDateColumn({
      field: 'UnitEnd',
      header: 'Lease End',
      filtering: false,
      format: 'MM/dd/YY',
    }),
    // {
    //   field: 'NumOfKeys',
    //   header: '# of Keys',
    //   //filter: { type: GridFilterControlType.CHECKBOX },
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'NumOfKeys',
      header: '# of Keys',
      filtering: false,
    }),
  ];

  initializeGlobalFilters() {
    this.globalFilters = [
      // {
      //   field: 'Department',
      //   displayText: 'Department',
      //   type: GridFilterControlType.INPUT,
      //   data: null,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      //   //filterType: EGridColumnType.DATE
      // },
      this.gridService.addGlobalInputFilter({
        field: 'Department',
        displayText: 'Department',
      }),
      // {
      //   field: 'SuiteStatus',
      //   displayText: 'Unit Status',
      //   type: GridFilterControlType.DROPDOWN,
      //   data: this.filterData,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      // },
      this.gridService.addGlobalDropdownFilter({
        field: 'SuiteStatus',
        displayText: 'Unit Status',
        data: this.filterData,
      }),
      // {
      //   field: 'Vendor', //need to add lookup
      //   displayText: 'Vendor',
      //   type: GridFilterControlType.INPUT,
      //   data: null,
      //   value: '',
      //   matchMode: null,
      //   operator: null,
      //   //filterType: EGridColumnType.DATE
      // },
      this.gridService.addGlobalInputFilter({
        field: 'Vendor',
        displayText: 'Vendor',
      }),
      // {
      //   field: 'CHUnit',
      //   displayText: 'Is CH Unit',
      //   type: GridFilterControlType.CHECKBOX,
      //   data: null,
      //   value: false,
      //   matchMode: null,
      //   operator: null,
      // },
      this.gridService.addGlobalBooleanFilter({
        field: 'CHUnit',
        displayText: 'Is CH Unit',
      }),
      // {
      //   field: 'PayOnTime',
      //   displayText: 'Pay On Time',
      //   type: GridFilterControlType.CHECKBOX,
      //   data: null,
      //   value: false,
      //   matchMode: null,
      //   operator: null,
      // },
      this.gridService.addGlobalBooleanFilter({
        field: 'PayOnTime',
        displayText: 'Pay On Time',
      }),
    ];
  }

  getSuites(request: IGridServerSideEvent = {}) {
    this.getSuitesData(request).subscribe(
      (response) => {
        this.suites = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.suites = [];
        this.totalRecords = 0;
      }
    );
  }

  getSuitesData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Suite-Select-List',
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
    //this.showModalForm(data);
    window.open(
      'suite-detail?suiteId=' +
        data.SuitId.trim() +
        '&&buildingId=' +
        data.BldgId.trim()
    );
  }

  handleSortChange(data) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.getSuites(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }

  showModalForm(data: any) {
    // show edit page as modal popup
    const ref = this.dialogService.open(SuiteDetailComponent, {
      header: 'Edit From',
      width: '70%',
      data: { suiteId: data.SuitId, buildingId: data.BldgId },
    });
  }

  newSuite() {
    window.open('suite-detail?suiteId=&&buildingId=');
  }
}
