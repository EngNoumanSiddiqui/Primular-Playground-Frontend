import { Component, Input, OnInit, Optional } from '@angular/core';
import {
  IGridServerSideEvent,
  ISelectItem,
  IGridPaginationEvent,
  IGridFilter,
  RequestDto,
  EGridValidator,
} from '@churchillliving/se-ui-toolkit';
import { EGridColumnType } from '../../models';
import { GridService } from '@churchillliving/se-ui-toolkit';
import { UserData } from '../../models/user.model';
import { EPermissionType, IPermission } from '../../models';
import {
  EAggregateFormat,
  EGridAggregate,
  EGridFormatter,
  IGridColumn,
} from '../../models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as utilities from '../../services/utilities.service';
import { SelectionComponent } from '../grid-selection/selection.component';
import { AlertService } from 'src/app/services/alert.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
})
export class GridViewComponent implements OnInit {
  public users: UserData[];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public columns: IGridColumn[] = [];
  public permissions: IPermission[] = [
    { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
    { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
    { type: EPermissionType.DELETE, roles: ['SalesRepManager'] },
    { type: EPermissionType.ADDROW, roles: ['SalesRepManager'] },
  ];
  public loading = true;

  public newRowData = {
    firstname: '',
    lastname: '',
    age: 40,
    createddate: new Date(),
    active: true,
    streetnumber: '',
  };

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.users = [];
    this.initializeFilters();
    this.initializeColumn().then((res) => {
      console.log('globalFilters:', this.columns);
      let gridFilters = utilities.getGridFilters();
      if (gridFilters && gridFilters.length > 0) {
        this.getUsers();
      }
    });
  }

  dropDownValue = [
    { label: '20', value: '20' },
    { label: '33', value: '33' },
    { label: '30', value: '30' },
    { label: '45', value: '45' },
  ];

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

  async initializeColumn() {
    let __this = this;
    let streetNum1 = await this.gridService.addDropdownColumn(
      {
        field: 'StreetNumber',
        header: 'Street Number',
        type: EGridColumnType.DROPDOWN,
      },
      false,
      {
        uniqueKey: 'Customer-GetStreetNumbers-StoredProcedure',
        valueProp: 'ID',
        labelProp: 'StREEtNUmber',
        filters: [utilities.setAndFilter('ID', 'lastname')],
      }
    );

    this.columns = [
      // {
      //   field: 'Id',
      //   header: 'Id',
      //   allowSave: false,
      // },
      this.gridService.addColumn({
        field: 'Id',
        header: 'Id',
        style: 'flex-basis: 15%',
        aggregate: [
          {
            displayField: 'age',
            type: EGridAggregate.SUM,
            format: { type: EAggregateFormat.NUMERIC },
            //caption: 'SUM1212',
          },
          {
            // displayField: '',
            type: EGridAggregate.COUNT,
            format: { type: EAggregateFormat.DECIMAL, digitsInfo: 3 },
            //caption: 'Count11',
          },
          {
            displayField: '',
            type: EGridAggregate.AVERAGE,
            caption: 'Average',
          },
        ],
      }),
      // this.gridService.addColumn({
      //   field: 'Id',
      //   header: 'Id',
      //   tableAlias: 'a',
      // }),z
      // {
      //   field: 'firstNAme',
      //   header: 'First Name',
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager1'] },
      //   // ],
      // },
      this.gridService.addColumn({
        field: 'firstname',
        header: 'First Name',
        tableAlias: 'ss',
        //disabled: true,
        filtering: false,
        style: 'flex-basis: 10%',
        //allowSave: false,
        validations: [{ type: EGridValidator.REQUIRED }],
        permissions: [
          { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
          //{ type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
        ],
      }),
      // {
      //   field: 'lastName',
      //   header: 'Last Name',
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   // ],
      // },
      // this.gridService.addColumn({
      //   field: 'LastName',
      //   header: 'Last Name',
      //   //disabled: true,
      //   style: 'flex-basis: 10%',
      //   permissions: [
      //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   ],
      // }),
      this.gridService.addLookUpColumn({
        field: 'lastname',
        header: 'Last Name',
        displayField: 'age',
        validations: [{ type: EGridValidator.REQUIRED }],
        // lookupControl: {
        //   component: SelectionComponent,
        //   data: {
        //     header: 'Grid selection',
        //     width: '80%',
        //     //matchField: 'age',
        //     //matchValue: 'lastname',
        //     data: {
        //       aa: 'age',
        //       lastname: 'CreatedDATE',
        //       LastName: '11',
        //       name: '1122',
        //     },
        //   },
        // },
        onFocusOut: function (res) {
          utilities.setGridLookupData(__this.columns, 'lastname', {
            b: '1155',
            name: 'Hello World',
          });
          console.log('__this.columns: ', __this.columns);
        },
      }),
      // this.gridService.addDateColumn({
      //   field: 'CreatedDATE',
      //   header: 'Created DATE 2',
      //   filtering: false,
      //   //format: 'MM/dd/YY',
      //   //format: 'YY-MM-dd hh:mm:ss a',
      //   //format: 'MM/dd/YY hh:mm:ss a',
      //   //disabled: true,
      //   style: 'flex-basis: 10%',
      //   permissions: [
      //     { type: EPermissionType.VIEW, roles: ['SalesRepManager11'] },
      //     { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
      //   ],
      // }),

      // {
      //   field: 'Age',
      //   header: 'Age',
      //   type: EGridColumnType.NUMERIC,
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.gridService.addInputColumn({
        field: 'AGe',
        header: 'Age',
        style: 'flex-basis: 10%',
        permissions: [
          { type: EPermissionType.VIEW, roles: ['SalesRepManager111'] },
          { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
        ],
        validations: [
          { type: EGridValidator.REQUIRED },
          { type: EGridValidator.EMAIL },
        ],
        // onFocusOut: function (res) {
        //   let returnValue = utilities.getGridFieldValue(
        //     __this.columns,
        //     'lastnamE',
        //     res
        //   );
        //   console.log('returnValue: ', returnValue);
        // },
        // aggregate: [
        //   {
        //   //  displayField: 'age',
        //     type: EGridAggregate.SUM,
        //     format: { type: EAggregateFormat.NUMERIC },
        //     //caption: 'SUM1212',

        //   },
        //   {
        //    // displayField: '',
        //     type: EGridAggregate.COUNT,
        //     format: { type: EAggregateFormat.DECIMAL, digitsInfo: 3 },
        //     //caption: 'Count11',
        //   },
        //   {
        //     displayField: '',
        //     type: EGridAggregate.AVERAGE,
        //     caption: 'Average',
        //   },
        // ],
      }),
      // {
      //   field: 'CreatedDate',
      //   header: 'Created Date',
      //   type: EGridColumnType.DATE,
      //   format: 'YY-MM-dd hh:mm:ss a', // reference: https://angular.io/api/common/DatePipe
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.gridService.addDateColumn({
        field: 'CreatedDATE',
        header: 'Date',
        filtering: false,
        type: EGridColumnType.DIALOG,
        component: SelectionComponent,
        data: { data: { hoursworkedid: '' } },
        format: 'EEE, MM/dd/YY',
        style: 'flex-basis: 6%',
        //check if vacation
      }),
      // this.gridService.addCalendarColumn({
      //   field: 'CreatedDATE',
      //   header: 'Created Date',
      //   format: 'YY-MM-dd hh:mm:ss a',
      //   style: 'flex-basis: 10%',
      //   //disabled: true,
      //   permissions: [
      //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   ],
      // }),
      this.gridService.addBooleanColumn({
        field: 'Active',
        header: 'Active',
        filtering: false,
        formatter: EGridFormatter.BOOLEAN,
        style: 'flex-basis: 10%',
        permissions: [
          { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
          { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
        ],
      }),
      // this.gridService.addBooleanColumn({
      //   field: 'Active',
      //   header: 'Active',
      // }),
      // {
      //   field: 'StreetNumber',
      //   header: 'Street Number',
      //   type: EGridColumnType.DROPDOWN,
      //   data: this.dropDownValue,
      //   style: 'flex-basis: 10%',
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.gridService.addAutoComplete({
        field: 'StreetNumber',
        header: 'Auto Complete',
        displayField: 'id',
        onFocusOut: function (column: IGridColumn) {
          console.log('onFocusOut:', column);
        },
        onReturn: function (search: any, column: IGridColumn) {
          if (search && column) {
            __this.gridService.getAutoCompleteData(
              column,
              'Customer-GetStreetNumbers-StoredProcedure',
              [utilities.setAndFilter('ID', this.id)]
            );
          }
        },
      }),
      //streetNum1,
      // this.gridService.addDropdownColumn({
      //   field: 'StreetNumber',
      //   header: 'Street Number',
      //   type: EGridColumnType.DROPDOWN,
      //   data: this.dropDownValue,
      //   style: 'flex-basis: 10%',
      //   permissions: [
      //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   ],
      // }),
      // this.gridService.addDropdownColumn({
      //   field: 'streetNUmber',
      //   header: 'Street Number',
      //   data: this.dropDownValue,
      // }),
      this.gridService.addButtonColumn({
        field: 'Click',
        header: 'Grid Button',
        icon: 'pi pi-check',
        //color: 'blue',
        onClick: (row) => {
          console.log('addButtonColumn: ', row);
        },
      }),
    ];
  }

  getUsers(request: IGridServerSideEvent = {}) {
    console.log('Request: is Here', request);
    this.getUsersData(request).subscribe(
      (response) => {
        this.users = response.records;
        this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.users = [];
        this.totalRecords = 0;
      }
    );
  }

  getUsersData(request: IGridServerSideEvent) {
    let filter = utilities.getGridFilters();
    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
      filters: filter && filter.length > 0 ? filter : request.filters,
      sorts: request.sorts,
      pageSize: request.pageSize,
      page: request.page,
    });
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
          this.loading = false;
        }
      );
  }

  updateRow(row: any) {
    console.log('updateRow: ', row);
    this.loading = true;
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
          this.loading = false;
        }
      );
  }

  insertInlineRow(row) {
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

  addInlineRow(row: any) {
    console.log('Add new row event invoked:', row);
    this.insertInlineRow(row);
  }

  handleRowClick(data: any) {
    console.log('Row Data', data);
  }

  handleRowCheckBox(data: any) {
    console.log('Row CheckBox Data: ', data);
  }

  handleSortChange(data: any) {
    console.log('Sort Information', data);
  }

  handleFilterChange(filters: IGridFilter[]) {
    console.log('Filters', filters);
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    console.log('filter main', filter.filters);
    this.getUsers(filter);
  }

  handleServerSideEventPagination(pagination: IGridPaginationEvent) {
    console.log('pagination-main', pagination);
  }
}
