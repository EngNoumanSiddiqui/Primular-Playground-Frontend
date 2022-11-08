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
  selector: 'app-code-selection',
  templateUrl: './code-selection.component.html',
  styleUrls: [],
})
export class CodeSelectionComponent implements OnInit {
  gridSelectionType: EGridSelectionType = EGridSelectionType.SINGLE;
  public selectedRows = undefined;

  private codeType: string;

  public lookUpColumns: IGridColumn[] = [
    {
      field: 'CodeVal',
      header: 'Code',
      filter: { type: GridFilterControlType.INPUT },
    },
    {
      field: 'CodeDesc',
      header: 'Description',
      filter: { type: GridFilterControlType.INPUT },
      hidden: true,
    },
  ];
  public codeSelectionData = [
    // { CodeVal: 101, CodeDesc: 'ABC' },
    // { CodeVal: 102, CodeDesc: 'ABCDEF' },
    // { CodeVal: 103, CodeDesc: 'ABCGHI' },
    // { CodeVal: 104, CodeDesc: 'ABCJKL' },
    // { CodeVal: 105, CodeDesc: 'ABCMNO' },
    // { CodeVal: 106, CodeDesc: 'ABCPQR' },
    // { CodeVal: 107, CodeDesc: 'ABCSTU' },
  ];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  rowActions: IGridRowAction[] = [
    //{
    //title: 'Select',
    //class: 'p-button-success mx-2',
    //onClick: (selectedRows: any) => {
    //        console.log('select event invoked:', selectedRows);
    //this.ref.close(selectedRows);
    //},
    //},
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
    this.codeType = this.config.data.codeType;
    this.lookUpColumns = this.config.data.columns ?? this.lookUpColumns;
  }

  /**
   * Sets lookup filter values
   */

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

    request.filters.push({
      field: 'CodeType',
      matchMode: 'equals',
      operator: 'and',
      value: this.codeType,
    });

    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'CodeList-Select-List',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
      sorts: request.sorts,
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
