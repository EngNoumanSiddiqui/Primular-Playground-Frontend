import { Component, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  EGridColumnType,
  IGridServerSideEvent,
  ISelectItem,
  IGridPaginationEvent,
  IGridColumn,
  IGridFilter,
  RequestDto,
} from '@churchillliving/se-ui-toolkit';
import {
  DropdownService,
  RequestService,
  AlertService,
} from '@churchillliving/se-ui-toolkit';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-suite-reason',
  templateUrl: './suite-reason.component.html',
  styleUrls: ['./suite-reason.component.scss'],
})
export class SuiteReasonComponent implements OnInit {
  public suiteReasons: any[];
  public totalRecords: number;
  public dropdownData: ISelectItem[] = [];
  public columns: IGridColumn[] = [];
  public suiteId: string = '';
  public buildingId: string = '';
  public loading = true;
  isFromModal: boolean = false;
  public reasonCodes: ISelectItem[] = [];

  public newRowData = {
    Reason: '',
    FromDate: '',
    ToDate: '',
    EnteredBy: '',
    EnteredOn: new Date(),
    Notes: '',
    LastUpdated: '',
    SuitId: this.suiteId,
    BldgId: this.buildingId,
  };

  constructor(
    public dialogService: DialogService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public router: Router,
    private requestService: RequestService,
    private dropdownService: DropdownService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.suiteReasons = [];
    this.initializeFilters();
    if (this.config) {
      this.isFromModal = true;
      if (
        this.config.data &&
        this.config.data.suiteId &&
        this.config.data.buildingId
      ) {
        this.suiteId = this.config.data.suiteId.toString();
        this.buildingId = this.config.data.buildingId.toString();
      }
      if (this.suiteId && this.buildingId) {
      }
      this.getSuiteReasons();
    }
    if (this.suiteId && this.buildingId) {
      this.getSuiteReasons();
    } else {
      this.route.queryParams.subscribe((params: Params) => {
        if (params.suiteId && params.buildingId) {
          this.suiteId = params.suiteId;
          this.buildingId = params.buildingId;
          this.getSuiteReasons();
        }
      });
    }
    this.newRowData.BldgId = this.buildingId;
    this.newRowData.SuitId = this.suiteId;
  }

  initializeFilters() {
    this.getReasonCodes();

    this.columns = [
      {
        field: 'SuitReasonID',
        header: 'Id',
        hidden: true,
      },
      {
        field: 'Reason',
        header: 'Reason',
        type: EGridColumnType.DROPDOWN,
        data: this.reasonCodes,
        //look up for REASONTAKEN
      },
      {
        field: 'FromDate',
        header: 'From Date',
        //format: 'shortDate',
        type: EGridColumnType.DATE,
        format: 'MM/dd/YY',
      },
      {
        field: 'ToDate',
        header: 'To Date',
        type: EGridColumnType.DATE,
        format: 'MM/dd/YY',
      },
      {
        field: 'EnteredBy',
        header: 'Entered By',
      },
      {
        field: 'EnteredOn',
        header: 'Enterd On',
        //type: EGridColumnType.DATE,
        format: 'MM/dd/YY, h:mm a',
      },
      {
        field: 'Notes',
        header: 'Notes',
      },
      {
        field: 'LastUpdated',
        header: 'Last Updated',
        type: EGridColumnType.DATE,
        format: 'MM-dd-YY',
        data: Date.now(),
      },
      {
        field: 'LastUpdatedBy',
        header: 'Updated By',
      },
      {
        field: 'SuitId',
        header: 'SuiteId',
        hidden: true,
      },
      {
        field: 'BldgId',
        header: 'Building Id',
        hidden: true,
      },
    ];
  }

  getSuiteReasons(request: IGridServerSideEvent = {}) {
    this.getSuiteReasonData(request).subscribe(
      (response) => {
        this.suiteReasons = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.suiteReasons = [];
        this.totalRecords = 0;
      }
    );
  }

  getSuiteReasonData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'SuiteReason-Select-List',
      filters: [
        {
          field: 'SuitId',
          matchMode: 'equals',
          operator: 'and',
          value: this.suiteId,
        },
        {
          field: 'BldgId',
          matchMode: 'equals',
          operator: 'and',
          value: this.buildingId,
        },
      ],
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  getReasonCodes(request: IGridServerSideEvent = {}) {
    this.getReasonsCodesData(request).subscribe(
      (response) => {
        this.reasonCodes.push(
          ...this.dropdownService.setDropDown(response, 'CodeVal', 'CodeVal')
        );
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.reasonCodes = [];
        this.totalRecords = 0;
      }
    );
  }

  getReasonsCodesData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'CodeList-Select-List',
      filters: [
        {
          field: 'CodeType',
          operator: 'and',
          matchMode: 'equals',
          value: 'REASONTAKEN',
        },
      ],
      //pageSize: request.pageSize,
      //page: request.page,
    });
  }

  deleteRow(row: any) {
    console.log('delete event invoked for row data:', row);
    this.requestService
      .get<any[], any>('/Data/Delete', {
        uniqueKey: 'SuiteReason-Delete',
        id: row.SuitReasonID,
      })
      .subscribe(
        (data) => {
          console.log('record deleted successfully');
          this.getSuiteReasons();
        },
        ({ error }) => {
          this.alertService.apiError(error);
          this.loading = false;
        }
      );
  }

  updateRow(row: any) {
    console.log('update event invoked for row data:', row);
    this.loading = false;
    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: 'SuiteReason-Update',
        values: row,
        filters: [
          {
            field: 'SuitReasonID',
            matchMode: 'equals',
            operator: 'and',
            value: row['SuitReasonID'],
          },
        ],
      })
      .subscribe(
        (data) => {
          console.log('record saved successfully');
          this.getSuiteReasons();
          this.loading = false;
        },
        ({ error }) => {
          this.alertService.apiError(error);
          this.loading = false;
        }
      );
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
    console.log('filter main', filter.filters);
    this.getSuiteReasons(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }

  addInlineRow(row: any) {
    console.log('Add new row event invoked:', row);
    this.loading = true;
    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: 'SuiteReason-Insert',
        values: row,
      })
      .subscribe(
        (data) => {
          console.log('record saved successfully');
          this.getSuiteReasons();
        },
        ({ error }) => {
          this.alertService.apiError(error);
          this.loading = false;
        }
      );
  }
}
