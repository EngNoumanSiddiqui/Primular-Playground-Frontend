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
  selector: 'app-building-selection',
  templateUrl: './building-selection.component.html',
  styles: [],
})
export class BuildingSelectionComponent implements OnInit {
  gridSelectionType: EGridSelectionType = EGridSelectionType.SINGLE;

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
        field: 'BldgId',
        header: 'BuildingId',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'BLDGNAME',
        header: 'Building Name',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'Address1',
        header: 'Address',
        filter: { type: GridFilterControlType.INPUT },
      },
      {
        field: 'City',
        header: 'City',
        filter: { type: GridFilterControlType.INPUT },
      },
    ];
  }

  getCodes(request: IGridServerSideEvent = {}) {
    this.getCodeSelectionData(request).subscribe(
      (response) => {
        this.codeSelectionData = response.records;
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
      uniqueKey: 'Building-Select-List',
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
