import { Type } from '@angular/core';
import { IDropDownRequest } from './form.model';
import { IPermission } from './user-info.model';

export interface IGridColumn {
  header?: string;
  field?: string;
  displayField?: string;
  type?: EGridColumnType;
  hidden?: boolean;
  hyperlink?: string;
  sorting?: boolean;
  filtering?: boolean;
  filter?: IGridFilterType;
  format?: string | EGridFormatType; // For more format options. visit https://angular.io/api/common/DatePipe
  data?: any;
  component?: Type<any>;
  target?: EGridlink;
  style?: string;
  permissions?: IPermission[];
  value?: any;
  tableAlias?: string;
  linkId?: string;
  params?: any;
  showTime?: boolean;
  timeOnly?: boolean;
  displayText?: string;
  disabled?: boolean;
  allowSave?: boolean;
  validations?: IGridValidation[];
  errorMessage?: string;
  isvalid?: boolean;
  onClick?: (row: any) => void;
  onReturn?: (value?: any, column?: any) => void;
  onFocusOut?: (value: any) => any;
  aggregate?: IGridAggregate[];
  formatter?: EGridFormatter;
  optionLabel?: string;
  optionValue?: string;
  dropDownProp?: IDropDownRequest;
  lookupControl?: IGridLookupControl;
  icon?: string;
  color?: string;
}

export interface IGridLookupControl {
  component?: any;
  data?: IGridLookupData;
}

export declare type IGridLookupData = {
  header: string;
  width: string;
  valueField?: string;
  selectedValue?: string;
  data: any;
} & {
  [key: string]: any;
};

export interface ILookupValue {
  text: string;
  value: string;
  field?: string;
}

export enum EGridAggregate {
  SUM = 'sum',
  AVERAGE = 'average',
  COUNT = 'count',
}

export interface IGridAggregate {
  type: EGridAggregate;
  caption?: string;
  displayField?: string;
  format?: IAggregateFormat;
  aggrValue?: string;
}
export interface IAggregateFormat {
  type: EAggregateFormat;
  digitsInfo?: number;
}

export enum EAggregateFormat {
  NUMERIC = 'numeric',
  DECIMAL = 'decimal',
}

export enum EGridlink {
  BLANK = '_blank',
  SELF = '_self',
}

export interface IGridDataExport {
  rows: any[];
  headings: string[];
}

export interface ISelectItem {
  label: string;
  value: string;
}

export interface IGridFilterType {
  type?: GridFilterControlType;
  data?: ISelectItem[];
}

export enum EGridFormatter {
  BOOLEAN = 'boolean',
  CHAR = 'char',
  NUMERIC = 'numeric',
}

export enum GridFilterControlType {
  INPUT = 'input',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  CALENDAR = 'calendar',
  CALENDAR_RANGE = 'calender_range',
  MULTISELECT = 'multi-select',
  NUMERICINPUT = 'numberic_input',
  LOOKUP_INPUT = 'lookup_input',
}

export enum EDayRange {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export enum EGridSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum EGridColumnType {
  LINK = 'link',
  IFRAME = 'iframe',
  DIALOG = 'dialog',
  TEXT = 'text',
  NUMERIC = 'numeric',
  DATE = 'date',
  BOOLEAN = 'boolean',
  DROPDOWN = 'dropdown',
  LOOKUP_INPUT = 'lookup_input',
  ADD_BUTTON = 'add_button',
  AUTOCOMPLETE = 'AutoComplete',
}

export interface IGlobalFilter extends IGridFilterType, IGridFilter {
  displayText?: string;
  onFocusOut?: (value: any) => any;
  optionLabel?: string;
  optionValue?: string;
  dayRange?: EDayRange;
  fromDateField?: string;
  toDateField?: string;
  format?: string | EGridFormatType;
  lookupControl?: ILookupControlFilter;
  allowSearch?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  color?: string;
}

export interface ILookupControlFilter {
  component?: any;
  data?: ILookupFilterData;
}

export declare type ILookupFilterData = {
  header: string;
  width: string;
  data: any;
} & {
  [key: string]: any;
};

export interface IPrimeNgSort {
  multisortmeta: { field: string; order: number };
}

export interface IPrimeNgFilterItem {
  matchMode: string;
  operator: string;
  value: string | number | boolean | Date | any;
}

export interface IPrimeNgFilter {
  filteredValue: any[];
  filters: Record<string, IPrimeNgFilterItem[] | IPrimeNgFilterItem>;
}

export interface IGridFilter {
  field?: string;
  matchMode?: string;
  operator?: string;
  value?: string | number | boolean | Date | any[];
  filtering?: boolean;
  tableAlias?: string;
  column?: string;
}

export interface IGridSort {
  field: string;
  direction: EGridSortDirection;
  priority: number;
  tableAlias?: string;
}

export class IGridServerSideEvent {
  filters?: IGridFilter[];
  sorts?: IGridSort[];
  page?: number;
  pageSize?: number;
}

export interface IGridPaginationEvent {
  first: number;
  rows: number;
}

export interface IGridColumnAction {
  icon: string; // Uses primeng/font-awesome icons. Example: 'pi pi-check'
  tooltip: string;
  width?: string;
  confirmDialog?: boolean;
  onClick: (row: any) => void;
}

export interface IGridRowAction {
  title: string;
  class?: string;
  onClick: (row: any) => void;
}

export enum EGridSelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export type MenuFilterControls =
  | GridFilterControlType.INPUT
  | GridFilterControlType.NUMERICINPUT
  | GridFilterControlType.CALENDAR;

export type IMenuFilter = Record<MenuFilterControls, ISelectItem[]>;

export interface addColumn {
  target?: EGridlink;
  component?: Type<any>;
  control?: EGridColumnType;
  field?: string;
  displayField?: string;
  header?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  style?: string;
  type?: EGridColumnType;
  format?: string | EGridFormatType; // format: 'YY-MM-dd hh:mm:ss a', reference: https://angular.io/api/common/DatePipe
  data?: any;
  filtering?: boolean;
  hidden?: boolean;
  hyperlink?: string;
  sorting?: boolean;
  filter?: IGridFilterType;
  tableAlias?: string;
  linkId?: string;
  params?: any;
  displayText?: string;
  disabled?: boolean;
  errorMessage?: string;
  validations?: IGridValidation[];
  isvalid?: boolean;
  allowSave?: boolean;
  onClick?: (row: any) => void;
  onReturn?: (value?: any, column?: any) => void;
  onFocusOut?: (value: any) => any;
  aggregate?: IGridAggregate[];
  formatter?: EGridFormatter;
  permissions?: IPermission[];
  optionLabel?: string;
  optionValue?: string;
  dropDownProp?: IDropDownRequest;
  lookupControl?: IGridLookupControl;
  icon?: string;
  color?: string;
  value?: any;
}

export interface addFilterColumn {
  control?: GridFilterControlType;
  field?: string;
  header?: string;
  filter?: GridFilterControlType;
  filtering?: boolean;
  showTime?: boolean;
  timeOnly?: boolean;
  hidden?: boolean;
  style?: string;
  format?: string;
  validations?: IGridValidation[] | any;
  errorMessage?: string;
  isvalid?: boolean;
  tableAlias?: string;
  disabled?: boolean;
  allowSave?: boolean;
  permissions?: IPermission[];
  component?: Type<any>;
  type?: EGridColumnType;
  data?: any;
}

export interface IGridValidation {
  type: EGridValidator;
  expression?: any;
}

export enum EGridValidator {
  REQUIRED = 'required',
  MINLENGTH = 'minlength',
  MAXLENGTH = 'maxlength',
  PATTERN = 'pattern',
  MINIMUM = 'minimum',
  MAXIMUM = 'maximum',
  NUMERIC = 'numeric',
  DECIMAL = 'decimal',
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum EGridFormatType {
  SHORTDATE = 'MM/dd/YY',
  MEDIUMDATE = 'M d, yy',
  LONGDATE = 'MM d, yyyy',
}

export interface addGlobalFilter {
  field?: string;
  displayText?: string;
  type?: GridFilterControlType;
  data?: any;
  value?: any;
  matchMode?: string;
  operator?: string;
  tableAlias?: string;
  optionLabel?: string;
  optionValue?: string;
  column?: string;
  onFocusOut?: (value: any) => any;
  filtering?: boolean;
  dayRange?: EDayRange;
  fromDateField?: string;
  toDateField?: string;
  lookupControl?: ILookupControlFilter;
  allowSearch?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  color?: string;
}
