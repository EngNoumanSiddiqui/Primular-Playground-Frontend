import { Type } from '@angular/core';
import { IGridSort, ISelectItem } from './grid.model';
import { IPermission } from './user-info.model';

export interface IDynamicForm {
  formSections?: IFormSection[];
  column?: number;
  permissions?: IPermission[];
}

export interface ILabel {
  name: string;
  labelControl?: IFormField;
  disabled?: boolean;
  onReturn?: (value: any) => void;
  onClick?: () => void;
}

export interface IFormSection {
  name?: string;
  fields: IFormField[];
  icon?: string;
  class?: string;
  links?: ILabel[];
  permissions?: IPermission[];
  hidden?: boolean;
  accordionDisabled?: boolean;
  showAccordion?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  disabledText?: boolean;
}

export interface IDropDownRequest {
  uniqueKey: string;
  valueProp: string;
  labelProp: string;
  filters?: ISetFilter[];
}

export interface ISetFilter {
  field?: string;
  value?: any;
  matchMode?: string;
  operator?: string;
  valueField?: string;
}

export interface IFormField {
  label?: string | ILabel | any;
  card?: IDynamicCard;
  control?: EFormControl;
  field?: string;
  displayField?: string;
  value?: any | ILookupInputValue;
  data?: any[];
  validations?: IValidation[];
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  disabledText?: boolean;
  lookupControl?: ILookupControlField;
  tables?: string[];
  componentControl?: IFormComponentField;
  column?: number;
  row?: number;
  hyperlink?: IHyperlink;
  format?: IFormat;
  permissions?: IPermission[];
  hidden?: boolean;
  onClick?: () => void;
  onReturn?: (value?: any, selectedRow?: any) => void;
  onFocusOut?: (value: any) => any;
  isvalid?: boolean;
  optionLabel?: string;
  optionValue?: string;
  timeOnly?: boolean;
  showTime?: boolean; // to show time as well in calendar form field
  monthOnly?: boolean;
  requiredField?: boolean;
  height?: string;
  showBottomBorder?: boolean;
  allowSearch?: boolean;
  selectMultipleFiles?: boolean;
  SetfileTypes?: ESelectFileType;
  icon?: string;
  color?: string;
}

export interface IDynamicCard {
  id?: number;
  name?: string;
  data?: any[];
  orderByField?: string;
  formSections?: IFormSection[];
  onSort?: (value: any) => any;
  allowDelete?: boolean;
  files?: IFile;
  onDelete?: (value: any) => any;
  class?: string;
}

export interface IFile {
  url?: string;
  caption?: string;
  width?: string;
  height?: string;
  id?: number;
  name?: string;
  allowDownloadFile?: boolean;
  allowEditableCaption?: boolean;
  allowDeleteFile?: boolean;
  onCaptionSave?: (value: any) => any;
}

export interface IListFilter {
  uniqueKey: string;
  filters?: ISetFilter[];
  sorts?: IGridSort[];
}

export interface IFormComponentField {
  component: Type<any>;
  id?: string;
  data?: {
    [key: string]: any;
  };
  handlers?: {
    [key: string]: Function;
  };
}

export interface ILookupInputValue {
  text: any;
  value: any;
}

export interface ILookupControlField {
  id?: string;
  component: any;
  data: ILookupFieldData | any;
}

export declare type ILookupFieldData = {
  header: string;
  width: string;
  data: any;
  valueField?: string;
  selectedValue?: string;
} & {
  [key: string]: any;
};

export interface IValidation {
  type: EValidator;
  expression?: any;
}

export enum ESelectFileType {
  EXCEL = 'excel',
  IMAGE = 'image',
  DOCUMENT = 'document',
  PDF = 'pdf',
}

export enum EValidator {
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

export enum EFormControl {
  BUTTON = 'button',
  LABEL = 'label',
  INPUT = 'input',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  CALENDAR = 'calender',
  NUMERIC = 'number',
  MULTISELECT = 'multi-select',
  TEXTAREA = 'text-area',
  HYPERLINK = 'hyperlink',
  LOOKUP_INPUT = 'lookup_input',
  NOTE_FIELD = 'note_field',
  COMPONENT = 'component',
  PASSWORD = 'password',
  AUTOCOMPLETE = 'AutoComplete',
  SPACER = 'spacer',
  SECTION_HEADER = 'section_header',
  FILE_UPLOAD = 'file_upload',
  CARD = 'card',
  DISPLAY_FILE = 'display_file',
  ADD_BUTTON = 'add_button',
  SWITCH = 'switch',
}

export interface IFormat {
  type: EFormatType;
  formatParams?:
    | IFormatParam
    | IDateFormatParam
    | INumberFormatParam
    | ICurrencyFormatParam;
  formatter?: (value: any) => any;
}

export interface IFormatParam {
  locale?: string;
}

export interface IDateFormatParam extends IFormatParam {
  format?: string;
}

export interface INumberFormatParam extends IFormatParam {
  digitsInfo?: string;
}

export interface ICurrencyFormatParam extends INumberFormatParam {
  currency: string;
}

export enum EFormatType {
  SHORTDATE = 'mm/dd/yy',
  MEDIUMDATE = 'M d, yy',
  LONGDATE = 'MM d, yy',
  MONTHONLY = 'mm/yy',
  BOOLEAN_YN = 'BOOLEAN_YN',
  CUSTOM = 'custom',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  DECIMAL = 'decimal',
}

export interface IHyperlink {
  target?: EHyperlink;
  link?: string;
  header?: string;
  linkId?: string;
  params?: any;
  width?: string;
  height?: string;
  component?: any;
}

export enum EHyperlink {
  BLANK = '_blank',
  SELF = '_self',
  PARENT = '_parent',
  TOP = '_top',
  IFRAME = '_iframe',
  DIALOG = '_dialog',
}

export interface AddFormField {
  control?: EFormControl;
  field?: string;
  displayField?: string;
  label?: string | ILabel;
  value?: string | any;
  format?: IFormat;
  permissions?: IPermission[];
  hidden?: boolean;
  validations?: IValidation[];
  hyperlink?: IHyperlink;
  lookupControl?: ILookupControlField;
  tables?: string[];
  disabled?: boolean;
  disabledText?: boolean;
  column?: number;
  row?: number;
  optionLabel?: string;
  optionValue?: string;
  componentControl?: IFormComponentField;
  data?: ISelectItem[];
  monthOnly?: boolean;
  showTime?: boolean; // to show time as well in calendar form field
  timeOnly?: boolean;
  onClick?: () => void;
  onReturn?: (value?: any, selectedRow?: any) => void;
  onFocusOut?: (value: any) => void;
  height?: string;
  showBottomBorder?: boolean;
  allowSearch?: boolean;
  selectMultipleFiles?: boolean;
  SetfileTypes?: ESelectFileType;
  icon?: string;
  color?: string;
  card?: IDynamicCard;
}
