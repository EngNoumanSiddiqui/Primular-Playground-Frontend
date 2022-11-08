import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { IDropDownRequest } from '../models';
import { DatePipe } from '@angular/common';
import {
  EGridSortDirection,
  GridFilterControlType,
  IGlobalFilter,
  IGridFilter,
  IGridSort,
  EGridColumnType,
  addColumn,
  addFilterColumn,
  addGlobalFilter,
  IGridColumn,
  EGridValidator,
} from '../models/grid.model';
import { HyperlinkService } from './hyperlink.service';
import * as utilities from 'src/app/services/utilities.service';
import { DropdownService } from './dropdown.service';
import { AlertService } from './alert.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(
    public datepipe: DatePipe,
    private hyperlinkService: HyperlinkService,
    private dropdownService: DropdownService,
    private alertService: AlertService,
    private requestService: RequestService
  ) {}

  /**
   *
   * @param event
   * Receives lazy event and returns after proper mapping
   */
  getGridFilters(event: LazyLoadEvent, columns: IGridColumn[]): IGridFilter[] {
    const filters = this.mapFilters(event, columns);
    return this.handleMultiFilterField(filters);
  }

  /**
   * @param filters
   * Receives filters and returns array after removing duplicates
   * and creating comma separated values for same filters
   */
  handleMultiFilterField(filters: IGridFilter[]): IGridFilter[] {
    return filters
      .map((x, i, arr) =>
        arr.some(
          (y, idx) =>
            y.field?.toLowerCase() === x.field?.toLowerCase() && i !== idx
        )
          ? {
              ...x,
              value: arr
                .filter(
                  (z) => z.field?.toLowerCase() === x.field?.toLowerCase()
                )
                .map((a) => a.value)
                .join(),
            }
          : x
      )
      .filter((f, i, arr) => arr.findIndex((x) => x.value === f.value) === i);
  }

  // Prepare basic grid filters
  prepareBasicFilters(
    event: LazyLoadEvent,
    columns: IGridColumn[]
  ): IGridFilter[] {
    return this.mapFilters(event, columns);
  }

  /**
   * Checks if filters has values then converts global filter values type into IGridFilter.
   */
  prepareGlobalFilters(globalFilters: IGlobalFilter[]): IGridFilter[] {
    const globalData: IGridFilter[] = [];

    globalFilters.forEach((filter: IGlobalFilter) => {
      if (
        ((typeof filter.value === 'string' || Array.isArray(filter.value)) &&
          filter.value.length) ||
        (typeof filter.value !== 'string' &&
          !Array.isArray(filter.value) &&
          filter.value) ||
        (typeof filter.value === 'boolean' && filter.value !== null) ||
        filter.type === GridFilterControlType.CALENDAR_RANGE
      ) {
        if (filter.type === GridFilterControlType.CALENDAR_RANGE) {
          // add filter for start date
          globalData.push({
            field: this.setGlobalFilterField(filter),
            matchMode: filter.matchMode ? filter.matchMode : 'gte',
            operator: filter.operator ? filter.operator : 'and',
            value: this.setGlobalFilterValue(filter),
            tableAlias: filter.tableAlias,
          });

          // add filter for end date
          globalData.push({
            field: this.setGlobalFilterField(filter, false),
            matchMode: filter.matchMode ? filter.matchMode : 'lte',
            operator: filter.operator ? filter.operator : 'and',
            value: this.setGlobalFilterValue(filter, false),
            tableAlias: filter.tableAlias,
          });
        } else {
          globalData.push({
            field: this.setGlobalFilterField(filter),
            matchMode:
              filter.type === GridFilterControlType.MULTISELECT
                ? 'in'
                : filter.matchMode,
            operator: filter.operator ? filter.operator : 'and',
            value: this.setGlobalFilterValue(filter),
            tableAlias: filter.tableAlias,
          });
        }
      }
    });
    return globalData;
  }

  setGlobalFilterField(
    filter: IGlobalFilter,
    isStartDate: boolean = true
  ): string {
    if (filter.type === GridFilterControlType.CALENDAR_RANGE) {
      if (isStartDate) {
        return filter.fromDateField;
      } else {
        return filter.toDateField;
      }
    } else {
      return filter.field;
    }
  }

  // set global filter value
  setGlobalFilterValue(
    filter: IGlobalFilter,
    isStartDate: boolean = true
  ): string | number | Date | boolean {
    switch (filter.type) {
      case GridFilterControlType.MULTISELECT:
        return (filter.value as any[]).join(',');
      case GridFilterControlType.CALENDAR:
        return this.getFormattedDate(filter.value as Date);
      case GridFilterControlType.CALENDAR_RANGE:
        let dateValues: string[] = filter.value
          ? filter.value.toString().split('|')
          : [];
        if (dateValues && dateValues.length == 2) {
          let dateValue: Date = isStartDate
            ? new Date(dateValues[0])
            : new Date(dateValues[1]);
          return this.getFormattedDate(dateValue);
        } else {
          return null;
        }
      case GridFilterControlType.CHECKBOX:
        return filter.value ? 1 : 0;
      default:
        return filter.value as string;
    }
  }

  checkValidity(columns, row) {
    let isValid: boolean = true;
    columns.map((item: IGridColumn) => {
      if (item.validations) {
        item.errorMessage = '';
        item.isvalid = true;
        for (let i = 0; i < item.validations.length; i++) {
          const valid = item.validations && item.header;
          if (
            item.validations[i].type == EGridValidator.REQUIRED &&
            !row[item.field] &&
            !item.hidden &&
            valid
          ) {
            isValid = row[item.field]
              ? true
              : this.setErrorMessage(item, `${valid} is required`);
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.MINLENGTH &&
            row[item.field].length < item.validations[i].expression
          ) {
            isValid =
              row[item.field] &&
              row[item.field].length > item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Minimum ${item.validations[i].expression} characters required`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.MAXLENGTH &&
            row[item.field].length > item.validations[i].expression
          ) {
            isValid =
              row[item.field] &&
              row[item.field].length < item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Maximum ${item.validations[i].expression} characters required`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.MINIMUM &&
            row[item.field] < item.validations[i].expression
          ) {
            isValid =
              row[item.field] &&
              row[item.field].length > item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Minimum ${valid} ${item.validations[i].expression}`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.MAXIMUM &&
            row[item.field] > item.validations[i].expression
          ) {
            isValid =
              row[item.field] &&
              row[item.field].length < item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Maximum ${valid} ${item.validations[i].expression}`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.PATTERN &&
            !row[item.field].match(item.validations[i].expression)
          ) {
            isValid =
              row[item.field] &&
              row[item.field].match(item.validations[i].expression)
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.NUMERIC &&
            !row[item.field].toString().match(/^(0|[-()1-9]\d*)$/)
          ) {
            isValid =
              row[item.field] && row[item.field].match(/^(0|[1-9]\d*)$/)
                ? true
                : this.setErrorMessage(
                    item,
                    `Enter ${item.validations[i].type} for ${valid}`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.PHONE &&
            !row[item.field]?.toString().match(/^(?=.*[0-9])[-()0-9\s]+$/)
          ) {
            isValid =
              row[item.field] &&
              row[item.field]?.toString().match(/^(?=.*[0-9])[-()0-9\s]+$/)
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.DECIMAL &&
            !row[item.field]?.toString().match(/^(0|[-()1-9]\d*)(\.\d+)?$/)
          ) {
            isValid =
              row[item.field] &&
              row[item.field]?.toString().match(/^(0|[1-9]\d*)(\.\d+)?$/)
                ? true
                : this.setErrorMessage(
                    item,
                    `Enter ${item.validations[i].type} for ${valid}`
                  );
            break;
          } else if (
            row[item.field] &&
            item.validations[i].type == EGridValidator.EMAIL &&
            !row[item.field]
              ?.toString()
              .match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
          ) {
            isValid =
              row[item.field] &&
              row[item.field]
                ?.toString()
                .match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          }
        }
      }
    });
    return isValid;
  }

  setErrorMessage(item: IGridColumn, errorMessage: string): boolean {
    item.errorMessage = errorMessage;
    item.isvalid = false;
    return false;
  }

  // set basic filter value
  setBasicFilterValue(filter: any): any {
    if (filter instanceof Date) {
      return this.getFormattedDate(filter);
    } else if (typeof filter === 'boolean') {
      return filter ? 1 : 0;
    } else {
      return filter;
    }
  }

  /**
   *
   * @param param
   * Receives lazy event and returns sort array
   */
  getGridSorts(
    { multiSortMeta }: LazyLoadEvent,
    columns: IGridColumn[]
  ): IGridSort[] {
    return (multiSortMeta || []).map(({ field, order }, i): any => ({
      field,
      direction: order > 0 ? EGridSortDirection.ASC : EGridSortDirection.DESC,
      priority: i + 1,
      tableAlias: this.setTableAlias(field, columns),
    }));
  }

  /**
   *
   * @param event
   * Handles default and lookup filters
   */
  mapFilters(event: any, columns: IGridColumn[]): IGridFilter[] {
    const filters: IGridFilter[] = [];
    Object.entries(event.filters).forEach(([field, value]: any) => {
      if (Array.isArray(value)) {
        (value as IGridFilter[]).forEach(
          ({ matchMode, operator, value: filter }) => {
            if (filter !== null) {
              filters.push({
                field,
                matchMode,
                operator,
                value: this.setBasicFilterValue(filter),
                tableAlias: this.setTableAlias(field, columns),
              });
            }
          }
        );
      } else {
        if (value.value !== '') {
          switch (typeof value.value) {
            case 'boolean':
              filters.push({
                field,
                matchMode: 'equals',
                operator: 'and',
                value: value.value ? 1 : 0,
                tableAlias: this.setTableAlias(field, columns),
              });
              break;
            case 'string':
              filters.push({
                field,
                matchMode: value.matchMode,
                operator: 'and',
                value: value.value,
                tableAlias: this.setTableAlias(field, columns),
              });
              break;
            case 'object':
              if (value.value instanceof Date) {
                filters.push({
                  field,
                  matchMode: 'equal',
                  operator: 'and',
                  value:
                    value.value instanceof Date
                      ? this.getFormattedDate(value.value)
                      : value.value,
                  tableAlias: this.setTableAlias(field, columns),
                });
              } else {
                (value.value || []).forEach((x: any) => {
                  filters.push({
                    field,
                    matchMode: value.matchMode,
                    operator: 'and',
                    value: x.value,
                    tableAlias: this.setTableAlias(field, columns),
                  });
                });
              }
              break;
            default:
              null;
          }
        }
      }
    });
    return filters;
  }

  setLookUpFilter(column: any, dialogService) {
    if (column.lookupControl) {
      let dataValue: any[] = [];
      let dataKey: any[] = [];
      let data = column.lookupControl?.data?.data;
      const keys = Object.keys(data);
      if (data && keys?.length > 0) {
        keys.forEach((key) => {
          if (data[key].toString().includes('{')) {
            dataValue.unshift(data[key]);
            dataKey.unshift(key);
            data[key] = '';
          }
        });
      }
      const ref = dialogService.open(
        column.lookupControl.component,
        column.lookupControl.data
      );
      ref.onClose.subscribe(
        (res) => {
          if (dataKey?.length > 0 && dataValue?.length > 0) {
            dataKey.forEach((key, keyIndex) => {
              dataValue.forEach((value, valueIndex) => {
                if (keyIndex === valueIndex) {
                  data[key] = value;
                }
              });
            });
          }
          if (res) {
            document.getElementById('lookUp_filter').focus();
            let field = column.field;
            column.value = res[field.toLowerCase()];
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
    }
  }

  // Set Hyperlink field as a param Value
  setFieldAsLinkParam(columns, field, response) {
    if (
      columns &&
      columns.length > 0 &&
      field &&
      response.records &&
      response.records.length > 0
    ) {
      this.setDataFields(response.records).forEach((res: any) => {
        let obj = columns.find((x) => x.field === field);
        if (obj && obj.params) {
          const keys = Object.keys(obj.params);
          keys.forEach((key: any) => {
            if (obj.params[key] && obj.params[key].toString().includes('{')) {
              let value = obj.params[key]
                .replace('{', '')
                .replace('}', '')
                .toLowerCase();
              obj.params[key] = res[value];
            }
          });
        }
      });
    }
  }

  hasAnyLinkColumn(columns: IGridColumn[]): boolean {
    return (
      columns &&
      columns.some(
        (x) =>
          x.type == EGridColumnType.LINK ||
          x.type == EGridColumnType.IFRAME ||
          x.type == EGridColumnType.DIALOG
      )
    );
  }

  setHyperlinks(fetchResponse: any, columns: IGridColumn[]): any {
    columns.forEach((column) => {
      if (column.type === EGridColumnType.DIALOG && !column.data) {
        this.alertService.error(
          `"Data" property is missing for "${column.header}" column`
        );
      }
    });
    let records: any = [];
    let data =
      fetchResponse && fetchResponse.records.length > 0
        ? this.setDataFields(fetchResponse.records)
        : [];
    let newRow: any;

    return this.hyperlinkService
      .addHyperlinks(columns)
      .then((linksResponse) => {
        data.forEach((row) => {
          newRow = { ...row };
          columns.forEach((col) => {
            let keys = Object.keys(row);
            if (col.type === EGridColumnType.DIALOG) {
              let field = col.field + '_obj';
              newRow[field] = { ...col };
              newRow[field].displayText = col.displayText
                ? row[col.displayText.toLowerCase()]
                : row[col.field.toLowerCase()];
              if (col.format && newRow[field].displayText) {
                newRow[field].displayText = this.datepipe.transform(
                  newRow[field].displayText,
                  col.format
                );
              }
              if (col.data && col.data.data) {
                col.data.data = utilities.findKeysAndValue(col.data.data, row);
              }
            }
            linksResponse.forEach((linkResponse) => {
              if (
                (col.type === EGridColumnType.LINK ||
                  col.type === EGridColumnType.IFRAME) &&
                col.linkId &&
                col.params &&
                col.linkId === linkResponse.linkId
              ) {
                const paramKeys: string[] = Object.keys(col.params);
                const link = utilities.setHyperlink(
                  keys,
                  row,
                  linkResponse.url,
                  paramKeys,
                  col.params
                );
                let field = col.field + '_obj';
                newRow[field] = { ...col };
                newRow[field].hyperlink = link;
                newRow[field].displayText = col.displayText
                  ? row[col.displayText.toLowerCase()]
                  : row[col.field.toLowerCase()];
              }
            });
          });
          records.push(newRow);
        });
        return records;
      });
  }

  /**
   *
   * @param event
   * Receives lazy event and returns page number
   */
  getGridPagination(event: any): number {
    return isNaN(event.first / event.rows) ? 1 : event.first / event.rows + 1;
  }

  // get formatted date
  getFormattedDate(value: Date): string {
    return new Date(`${value} Z`).toISOString().slice(0, 10);
  }

  // add simple grid column without
  addColumn(columnInfo: addColumn): any {
    const column: IGridColumn = {
      field: columnInfo.field,
      header: columnInfo.header,
      style: columnInfo.style,
      type: columnInfo.type,
      format: columnInfo.format,
      data: columnInfo.data,
      filtering: columnInfo.filtering,
      hidden: columnInfo.hidden,
      sorting: columnInfo.sorting,
      filter: columnInfo.filter,
      hyperlink: columnInfo.hyperlink,
      tableAlias: columnInfo.tableAlias,
      params: columnInfo.params,
      linkId: columnInfo.linkId,
      displayText: columnInfo.displayText,
      target: columnInfo.target,
      disabled: columnInfo.disabled,
      allowSave: columnInfo.allowSave,
      component: columnInfo.component,
      onClick: columnInfo.onClick,
      onReturn: columnInfo.onReturn,
      onFocusOut: columnInfo.onFocusOut,
      aggregate: columnInfo.aggregate,
      formatter: columnInfo.formatter,
      permissions: columnInfo.permissions,
      optionLabel: columnInfo.optionLabel,
      optionValue: columnInfo.optionValue,
      dropDownProp: columnInfo.dropDownProp,
      showTime: columnInfo.showTime,
      timeOnly: columnInfo.timeOnly,
      lookupControl: columnInfo.lookupControl,
      displayField: columnInfo.displayField,
      icon: columnInfo.icon,
      color: columnInfo.color,
      value: columnInfo.value,
      validations: columnInfo.validations,
    };

    return column;
  }

  // add simple input grid column
  addInputColumn(
    filterColumnInfo: addColumn,
    showFilter: boolean = true
  ): IGridColumn {
    if (showFilter) {
      filterColumnInfo.filter = { type: GridFilterControlType.INPUT };
    }
    return this.addColumn(filterColumnInfo);
  }

  // add simple numeric grid column without
  addNumericColumn(
    columnInfo: addColumn,
    showFilter: boolean = true
  ): IGridColumn {
    if (showFilter) {
      columnInfo.filter = { type: GridFilterControlType.NUMERICINPUT };
    }
    columnInfo.type = EGridColumnType.NUMERIC;
    return this.addColumn(columnInfo);
  }

  // add simple calendar grid column without
  addCalendarColumn(
    columnInfo: addColumn,
    showFilter: boolean = true
  ): IGridColumn {
    if (showFilter) {
      columnInfo.filter = { type: GridFilterControlType.CALENDAR };
    }
    columnInfo.type = columnInfo.type ? columnInfo.type : EGridColumnType.DATE;
    return this.addColumn(columnInfo);
  }

  // add simple boolean grid column without
  addBooleanColumn(
    columnInfo: addColumn,
    showFilter: boolean = true
  ): IGridColumn {
    if (showFilter) {
      (columnInfo.type = EGridColumnType.BOOLEAN),
        (columnInfo.filter = { type: GridFilterControlType.CHECKBOX });
    }
    return this.addColumn(columnInfo);
  }

  // add LookUp Field for Grid
  addLookUpColumn(
    columnInfo: addColumn,
    showFilter: boolean = true
  ): IGridColumn {
    if (showFilter) {
      columnInfo.filter = { type: GridFilterControlType.LOOKUP_INPUT };
    }
    columnInfo.type = EGridColumnType.LOOKUP_INPUT;
    return this.addColumn(columnInfo);
  }

  // add Button for grid column
  addButtonColumn(columnInfo: addColumn): IGridColumn {
    columnInfo.type = EGridColumnType.ADD_BUTTON;
    if (!columnInfo.field) {
      columnInfo.field = columnInfo.value ? columnInfo.value : columnInfo.icon;
    }
    return this.addColumn(columnInfo);
  }

  // add AutoComplete for grid column
  addAutoComplete(columnInfo: addColumn): IGridColumn {
    columnInfo.type = EGridColumnType.AUTOCOMPLETE;
    return this.addColumn(columnInfo);
  }

  // Search AutoComplete Data for Grid
  getAutoCompleteData(
    column?: IGridColumn,
    uniqueKey?: string,
    filters?: any[]
  ): any {
    this.requestService
      .get<any[], any>('/Data/Fetch', { uniqueKey: uniqueKey, filters })
      .subscribe((response) => {
        column.data = this.setDataFields(response.records);
      });
  }

  // add simple dropdown grid column without
  addDropdownColumn(
    columnInfo: addColumn,
    showFilter: boolean = true,
    dropDownProp?: IDropDownRequest
  ) {
    if (showFilter) {
      columnInfo.filter = { type: GridFilterControlType.DROPDOWN };
    }

    if (dropDownProp) {
      columnInfo.dropDownProp = dropDownProp;
      let uniqueKey = dropDownProp.uniqueKey;
      let valueProp = dropDownProp.valueProp;
      let labelProp = dropDownProp.labelProp;
      let filters = dropDownProp.filters;
      if (uniqueKey && valueProp && labelProp) {
        return this.setDropdownData(
          columnInfo,
          uniqueKey,
          valueProp,
          labelProp,
          filters
        );
      }
    } else {
      return this.addColumn(columnInfo);
    }
  }

  setDropdownData(
    fieldInfo: any,
    uniqueKey: string,
    valueProp: string,
    labelProp: string,
    filters,
    row?: any
  ) {
    return this.dropdownService
      .setDropDownList(uniqueKey, valueProp, labelProp, filters)
      .then((res: any) => {
        if (row) {
          row[fieldInfo.field + '_data'] = res;
        } else {
          fieldInfo.data = res;
        }
        return this.addColumn(fieldInfo);
      })
      .catch((error) => {
        this.alertService.apiError(error);
      });
  }

  // add grid column with built-in filter
  addFilterColumn(filterColumnInfo: addFilterColumn): IGridColumn {
    const column: IGridColumn = {
      field: filterColumnInfo.field,
      header: filterColumnInfo.header,
      filter: { type: filterColumnInfo.filter },
      filtering: filterColumnInfo.filtering,
      hidden: filterColumnInfo.hidden,
      style: filterColumnInfo.style,
      tableAlias: filterColumnInfo.tableAlias,
      permissions: filterColumnInfo.permissions,
    };

    return column;
  }

  // add date grid column with
  addDateColumn(dateColumnInfo: addFilterColumn): IGridColumn {
    const column: IGridColumn = {
      field: dateColumnInfo.field,
      header: dateColumnInfo.header,
      type: dateColumnInfo.type ? dateColumnInfo.type : EGridColumnType.DATE,
      filtering: dateColumnInfo.filtering,
      filter: { type: GridFilterControlType.CALENDAR },
      format: dateColumnInfo.format,
      style: dateColumnInfo.style,
      tableAlias: dateColumnInfo.tableAlias,
      disabled: dateColumnInfo.disabled,
      allowSave: dateColumnInfo.allowSave,
      permissions: dateColumnInfo.permissions,
      component: dateColumnInfo.component,
      timeOnly: dateColumnInfo.timeOnly,
      showTime: dateColumnInfo.showTime,
      data: dateColumnInfo.data,
      hidden: dateColumnInfo.hidden,
    };
    return column;
  }

  // add grid global filter with
  addGlobalFilter(globelFilterInfo: addGlobalFilter) {
    const column: addGlobalFilter = {
      field: globelFilterInfo.field,
      displayText: globelFilterInfo.displayText,
      type: globelFilterInfo.type,
      data: globelFilterInfo.data,
      value: globelFilterInfo.value,
      matchMode: globelFilterInfo.matchMode,
      operator: globelFilterInfo.operator,
      tableAlias: globelFilterInfo.tableAlias,
      optionLabel: globelFilterInfo.optionLabel,
      optionValue: globelFilterInfo.optionValue,
      onFocusOut: globelFilterInfo.onFocusOut,
      column: globelFilterInfo.column,
      filtering: globelFilterInfo.filtering,
      dayRange: globelFilterInfo.dayRange,
      fromDateField: globelFilterInfo.fromDateField,
      toDateField: globelFilterInfo.toDateField,
      lookupControl: globelFilterInfo.lookupControl,
      allowSearch: globelFilterInfo.allowSearch,
      disabled: globelFilterInfo.disabled,
      hidden: globelFilterInfo.hidden,
      color: globelFilterInfo.color,
    };
    return column;
  }

  // add global input filter
  addGlobalInputFilter(globelFilterInfo: addGlobalFilter) {
    globelFilterInfo.type = GridFilterControlType.INPUT;
    return this.addGlobalFilter(globelFilterInfo);
  }

  // add global dropdown filter
  addGlobalDropdownFilter(
    globelFilterInfo: IGlobalFilter,
    dropDownProp?: IDropDownRequest
  ): any {
    globelFilterInfo.type = GridFilterControlType.DROPDOWN;
    if (dropDownProp) {
      let uniqueKey = dropDownProp.uniqueKey;
      let valueProp = dropDownProp.valueProp;
      let labelProp = dropDownProp.labelProp;
      let filters = dropDownProp.filters;
      if (uniqueKey && valueProp && labelProp) {
        return this.getDropdownData(
          globelFilterInfo,
          uniqueKey,
          valueProp,
          labelProp,
          filters
        );
      }
    } else {
      return this.addGlobalFilter(globelFilterInfo);
    }
  }

  getDropdownData(
    fieldInfo,
    uniqueKey: string,
    valueProp: string,
    labelProp: string,
    filters
  ) {
    return this.dropdownService
      .setDropDownList(uniqueKey, valueProp, labelProp, filters)
      .then((res: any) => {
        fieldInfo.data = res;
        return this.addGlobalFilter(fieldInfo);
      })
      .catch((error) => {
        this.alertService.apiError(error);
      });
  }

  // add global boolean filter
  addGlobalBooleanFilter(globelFilterInfo: addGlobalFilter) {
    globelFilterInfo.type = GridFilterControlType.CHECKBOX;
    return this.addGlobalFilter(globelFilterInfo);
  }

  // add Range Filter for global Filter
  addRangeFilter(globelFilterInfo: addGlobalFilter) {
    globelFilterInfo.type = GridFilterControlType.CALENDAR_RANGE;
    return this.addGlobalFilter(globelFilterInfo);
  }

  // add LookUp Field for global Filter
  addGlobalLookupFilter(globelFilterInfo: addGlobalFilter) {
    globelFilterInfo.type = GridFilterControlType.LOOKUP_INPUT;
    return this.addGlobalFilter(globelFilterInfo);
  }

  setDataFields(response: any, dataKey: string = '') {
    let data: any = [];
    if (response && response.length > 0) {
      response.map((x: any, index: number) => {
        const result = Object.keys(x).reduce(
          (prev, current) => ({ ...prev, [current.toLowerCase()]: x[current] }),
          {}
        );

        if (
          dataKey &&
          dataKey.length > 0 &&
          !Object.keys(result).includes(dataKey)
        ) {
          result[dataKey] = index;
        }

        data.push(result);
      });
    }
    return data;
  }

  // change linkId in edit mode, if changeLink is true then it change the edited row hyperlink value
  setLinkId(
    columns: IGridColumn[],
    field: string,
    linkId: string,
    record: any,
    users,
    params: any = null,
    changeLink: boolean = false
  ): any {
    if (columns && columns.length > 0) {
      columns.forEach((column: any) => {
        if (column.field?.toLowerCase() === field.toLowerCase()) {
          column.linkId = linkId;
          if (params) {
            column.params = params;
          }
        }
      });
    }

    this.setHyperlinks({ records: [record] }, columns).then((res) => {
      if (changeLink) {
        delete res[0][field.toLowerCase() + '_obj'];
        let index = users.findIndex(
          (i: any) => i[field.toLowerCase()] === record[field.toLowerCase()]
        );
        if (index !== -1) {
          users[index][field + '_obj'].hyperlink =
            res[0][field + '_obj'].hyperlink;
        }
      }
    });
  }

  // set grid data and set selected row based on selection value
  setDataWithSelectedRow(records: any, configData: any) {
    if (configData?.selectedValue && configData.data.selection) {
      records.forEach((record: any) => {
        Object.keys(record)?.forEach((key) => {
          if (key.toLowerCase() === configData.selectedValue.toLowerCase()) {
            if (
              configData.data.value &&
              record[key] === configData.data.value
            ) {
              record['highlightRow'] = true;
            } else if (record[key] === configData.data.selection) {
              record['highlightRow'] = true;
            }
          }
        });
      });
    }

    return records;
  }

  setColumnFields(columns: any[]) {
    let column: any = [];
    if (columns && columns.length > 0) {
      columns.map((col: any) => {
        column.push({ ...col, field: col.field.toLowerCase() });
      });
      return column;
    }
  }

  setTableAlias(field: string, columns: IGridColumn[]) {
    if (columns && columns.length > 0) {
      const column = columns.find(
        (x) => x.field.toLowerCase() == field.toLowerCase()
      );

      if (column != null && column.tableAlias && column.tableAlias.length > 0) {
        return column.tableAlias;
      }
    }

    return '';
  }
}
