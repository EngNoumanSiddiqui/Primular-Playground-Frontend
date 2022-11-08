import { Component, OnInit } from '@angular/core';
import {
  EGridColumnType,
  GridFilterControlType,
  IGridFilter,
  IGridServerSideEvent,
  ISelectItem,
  RequestDto,
  EGridlink,
} from '../../models';
import { UserData } from '../../models/user.model';
import { AlertService } from '../../services/alert.service';
import { RequestService } from '../../services/request.service';
import { GridService } from '../../services/grid.service';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { SelectionComponent } from '../grid-selection/selection.component';
import { IGridColumn } from '../../models';
import * as utilities from '../../services/utilities.service';
import { HyperlinkService } from 'src/app/services/hyperlink.service';
@Component({
  selector: 'app-grid-lookup',
  templateUrl: './grid-lookup.component.html',
})
export class GridlookupComponent implements OnInit {
  message: any[] = [];
  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];

  constructor(
    private requestService: RequestService,
    private hyperLinkService: HyperlinkService,
    private alertService: AlertService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
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
  }

  lookUpColumns: IGridColumn[] = [
    // {
    //   field: 'Id',
    //   header: 'Id',
    //   filter: { type: GridFilterControlType.INPUT },
    //   tableAlias: 'Id',
    // },
    this.gridService.addInputColumn({
      field: 'FirstName',
      header: 'LINK 1 ',
      linkId: 'ccc',
      // displayText: '{age}',
      //filter: { type: GridFilterControlType.INPUT },
      //target: EGridlink.SELF,
      type: EGridColumnType.LINK,
      params: {},
      onReturn: function (res) {
        console.log('onReturn', res);
      },
      allowSave: false,
    }),
    // this.gridService.addColumn({
    //   field: 'FirstName',
    //   header: 'link 2',
    //   // displayField: 'test',
    //   filtering: false,
    //   linkId: 'ccc',
    //   filter: { type: GridFilterControlType.INPUT },
    //   type: EGridColumnType.LINK,
    //   params: { LastName: '' },
    //   allowSave: true,
    // }),

    this.gridService.addInputColumn({
      field: 'age',
      header: 'LINK1',
      filter: { type: GridFilterControlType.INPUT },
      //displayText: '{FirstName}',
      type: EGridColumnType.DIALOG,
      component: SelectionComponent,
      data: {
        header: 'Edit From',
        width: '70%',
        data: { FirstNAMe: '', test: 'hello' },
      },
      onReturn: (data: any) => {
        console.log('onReturn:', data);
      },
    }),

    // this.gridService.addInputColumn({
    //   field: 'LastName',
    //   header: 'LINK2',
    //   linkId: 'suithold',
    //   //displayText: '{age}',
    //   filter: { type: GridFilterControlType.INPUT },
    //   type: EGridColumnType.IFRAME,
    //   params: { LastName: '', age: '' },
    //   onReturn: function (res) {
    //     console.log('onReturn', res);
    //   },
    // }),
    // {
    //   field: 'FirstName',
    //   header: 'FirstName',
    //   filter: {
    //     type: GridFilterControlType.DROPDOWN,
    //     data: this.dropdownData,
    //   },
    // },
    // this.gridService.addColumn({
    //   field: 'FirstName',
    //   header: 'FirstName',
    //   filter: {
    //     type: GridFilterControlType.DROPDOWN,
    //     data: this.dropdownData,
    //   },
    // }),
    // {
    //   field: 'LastName',
    //   header: 'LastName',
    //   filter: { type: GridFilterControlType.INPUT },
    // },
    this.gridService.addLookUpColumn({
      field: 'Age',
      header: 'Country',
      filtering: true,
      displayText: '{Age}',
      disabled: false,
      lookupControl: {
        component: SelectionComponent,
        data: {
          header: 'Age',
          width: '40%',
          selectedValue: 'Age',
          valueField: 'Age',
          data: {},
        },
      },
    }),
    this.gridService.addInputColumn({
      field: 'LastName',
      header: 'LastName',
      filter: { type: GridFilterControlType.INPUT },
    }),
    // {
    //   field: 'Age',
    //   header: 'Age',
    //   type: EGridColumnType.NUMERIC,
    //   filter: {
    //     type: GridFilterControlType.MULTISELECT,
    //     data: this.multiSelectData,
    //   },
    // },
    {
      field: 'CreatedDate',
      header: 'CreatedDate',
      type: EGridColumnType.DATE,
      filter: { type: GridFilterControlType.CALENDAR },
      format: 'MM-dd-YY', // reference: https://angular.io/api/common/DatePipe
    },
    {
      field: 'Active',
      header: 'Active',
      type: EGridColumnType.BOOLEAN,
      filter: { type: GridFilterControlType.CHECKBOX },
    },
  ];

  getUsers(request: IGridServerSideEvent = {}) {
    this.getUsersData(request).subscribe(
      (response) => {
        if (this.gridService.hasAnyLinkColumn(this.lookUpColumns)) {
          this.gridService
            .setHyperlinks(response, this.lookUpColumns)
            .then((res) => {
              this.users = res;
              this.lookUpColumns = [...this.lookUpColumns];
            });
        } else {
          this.users = response.records;
        }

        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.users = [];
        this.totalRecords = 0;
      }
    );
  }

  async confirm() {
    this.message = await this.alertService.confirm();
  }

  getUsersData(request: IGridServerSideEvent) {
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
      sorts: request.sorts,
    });
  }

  AddNewRow(row: any) {
    this.lookUpColumns = [
      ...utilities.enabledEditRowColumn(this.lookUpColumns, 'lastname'),
    ];
  }

  addInlineRow(row: any) {
    console.log('Add new row event invoked:', row);
    this.insertInlineRow(row);
  }

  insertInlineRow(row: any) {
    console.log('insertInlineRow: ', row);
    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: 'Customer-Query-Insert-WithoutAliases',
        values: row,
      })
      .subscribe(
        (data) => {
          this.alertService.success('Record saved successfully');
          console.log('record saved successfully');
          this.getUsers();
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  deleteRow(row: any) {
    console.log('delete event invoked for row data:', row);
    this.requestService
      .get<any[], any>('/Data/Delete', {
        uniqueKey: 'Customer-Query-Delete',
        id: row.id,
      })
      .subscribe(
        (data) => {
          this.alertService.success('Record deleted successfully');
          console.log('record deleted successfully');
          this.getUsers();
        },
        ({ error }) => {
          this.alertService.apiError(error);
          //   this.loading = false;
        }
      );
  }

  updateRow(row: any) {
    this.users = this.gridService.setLinkId(
      this.lookUpColumns,
      'FirstName',
      'ccc',
      row,
      this.users,
      { LastName: '', age: '' },
      false
    );
    console.log('updateRow: ', row);
    //  this.loading = true;
    console.log('update event invoked for row data:', row);
    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: 'Customer-Query-Update-WithoutAliases',
        filters: [
          {
            field: 'Id',
            matchMode: 'equals',
            operator: 'and',
            value: row['Id'],
          },
        ],
        values: row,
      })
      .subscribe(
        (data) => {
          this.alertService.success('Record Updated successfully');
          console.log('record saved successfully');
          this.getUsers();
        },
        ({ error }) => {
          this.alertService.apiError(error);
          //    this.loading = false;
        }
      );
  }

  handleRowClick(data: any) {
    console.log('Row Data', data);
  }

  onGridRowEdit(row: any) {
    this.gridService.setLinkId(
      this.lookUpColumns,
      'FirstName',
      'bbb',
      row,
      this.users,
      { LastName: '', age: '' },
      true
    );
    if (row.id === 1) {
      this.lookUpColumns = [
        ...utilities.disableEditRowColumn(this.lookUpColumns, 'lastname'),
      ];
    }
    if (row.id !== 1) {
      this.lookUpColumns = [
        ...utilities.enabledEditRowColumn(this.lookUpColumns, 'lastname'),
      ];
    }
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
}
