import { Component, Optional, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  IGridColumn,
  IGridServerSideEvent,
  RequestDto,
  IGlobalFilter,
} from 'src/app/models';
import { AlertService, RequestService } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-suite-hold',
  templateUrl: './suite-hold.component.html',
  styles: [],
})
export class SuiteHoldComponent implements OnInit {
  suiteId: string = 'B1354';
  buildingId: string = '';
  isFromModal: boolean = false;
  holds: any[] = [];
  public globalFilters: IGlobalFilter[] = [];
  globalFilterData: IGlobalFilter[] = [];

  public columns: IGridColumn[] = [
    {
      field: 'AccountNum',
      header: 'Acct #',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
    {
      field: 'HoldForSP',
      header: 'Hold for SP',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
    {
      field: 'HoldReason',
      header: 'Reason',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
    {
      field: 'HoldFrom',
      header: 'Hold From',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
    {
      field: 'HoldUntil',
      header: 'Hold Until',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
    {
      field: 'HoldDate',
      header: 'Hold Date',
      //filter: { type: GridFilterControlType.INPUT },
      filtering: false,
    },
  ];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    public router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config) {
      this.isFromModal = true;
      if (this.config.data && this.config.data.suiteId) {
        this.suiteId = this.config.data.suitId.toString();
        this.buildingId = this.config.data.buildingId.toString();
      }
      if (this.suiteId) {
      }
      this.getHolds();
    }
    if (this.suiteId) {
      this.getHolds();
    }
  }

  getHolds(request: IGridServerSideEvent = {}) {
    this.getHoldData(request).subscribe(
      (response) => {
        this.holds = response.records;
        // this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.holds = [];
      }
    );
  }
  getHoldData(request: IGridServerSideEvent) {
    if (!request.filters) {
      request.filters = [];
    }
    request.filters.push({
      field: 'SuiteId',
      matchMode: 'equals',
      operator: 'and',
      value: this.suiteId,
    });
    // request.filters.push({
    //   field: 'Type',
    //  matchMode: 'equals',
    //   operator: 'and',
    //   value: 'blank',
    // });
    // request.filters.push({
    // field: 'Active',
    //matchMode: 'equals',
    //operator: 'and',
    //value: 1,
    //});

    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'SuiteHold-Select-List',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }
  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter);
    this.getHolds(filter);
  }
}
