import { Component, OnInit, Optional } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  AlertService,
  EGridSelectionType,
  GridFilterControlType,
  IGridColumn,
  IGridRowAction,
  IGridServerSideEvent,
  RequestDto,
  RequestService,
} from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-workflowuser-selection',
  templateUrl: './workflowuser-selection.component.html',
  styles: [],
})
export class WorkflowUserSelectionComponent implements OnInit {
  gridSelectionType: EGridSelectionType = EGridSelectionType.SINGLE;
  public selectedRows = undefined;

  private codeType: string;

  public lookUpColumns: IGridColumn[] = [];
  public codeSelectionData = [];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  rowActions: IGridRowAction[] = [
    {
      title: 'Select',
      class: 'p-button-success mx-2',
      onClick: (selectedRows: any) => {
        console.log('select event invoked:', selectedRows);
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

  ngOnInit(): void {
    this.initializeLookupFilters();
    //this.codeType = this.config.data.codeType;
  }

  /**
   * Sets lookup filter values
   */
  initializeLookupFilters() {
    this.lookUpColumns = [
      {
        field: 'WorkFlowUserId',
        header: 'User',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'Name',
        header: 'Name',
        filter: { type: GridFilterControlType.INPUT },
      },
    ];
  }

  getCodes(request: IGridServerSideEvent = {}) {
    this.getCodeSelectionData(request).subscribe(
      (response) => {
        this.codeSelectionData = response.records;
        this.selectedRows = this.codeSelectionData.find(
          (x) => x[this.config.data.matchField] === this.config.data.selection
        );
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.codeSelectionData = [];
      }
    );
  }

  getCodeSelectionData(request: IGridServerSideEvent) {
    request.filters.forEach((item) => {
      if (typeof item.value === 'boolean') {
        item.value = item.value ? 1 : 0;
      }
    });

    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'WorkflowUser-Select-List',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('loading codes with filters:', filter);
    this.getCodes(filter);
  }

  handleRowClick(data) {
    this.ref.close(data);
  }
}
