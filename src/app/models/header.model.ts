import { EFormControl, IHyperlink } from './form.model';
import { IPermission } from './user-info.model';

export interface IHeader {
  fields: IHeaderField[];
  column?: number;
  permissions?: IPermission[];
}

export interface IHeaderField {
  label: string;
  value: any;
  control: EFormControl;
  data?: any[];
  onClick?: () => void;
  class?: string;
  column?: number;
  hyperlink?: IHyperlink;
  permissions?: IPermission[];
  disabled?: boolean;
  hidden?: boolean;
  format?: IHeaderFormat;
  showTime?: boolean;
  timeOnly?: boolean;
}

export enum EButtonClass {
  NORMAL = 'p-button-sm',
  SUCCESS = 'p-button-success p-button-sm',
  INFO = 'p-button-info p-button-sm',
  WARNING = 'p-button-warning p-button-sm',
  HELP = 'p-button-help p-button-sm',
  DANGER = 'p-button-danger p-button-sm',
}

export interface AddHeaderField {
  control?: EFormControl;
  label?: string;
  value?: string;
  column?: number;
  data?: any;
  class?: string;
  onClick?: (() => void) | any;
  hyperlink?: IHyperlink;
  permissions?: IPermission[];
  disabled?: boolean;
  hidden?: boolean;
  format?: IHeaderFormat;
  showTime?: boolean;
  timeOnly?: boolean;
}

export interface IHeaderFormat {
  type: EHeaderFormatType | any;
  formatParams?:
    | IFormatParams
    | IDateFormatParams
    | INumberFormatParams
    | ICurrencyFormatParams;
  formatter?: (value: any) => any;
}

export interface IFormatParams {
  locale?: string;
}

export interface IDateFormatParams extends IFormatParams {
  format?: string;
}

export interface INumberFormatParams extends IFormatParams {
  digitsInfo?: string;
}

export interface ICurrencyFormatParams extends INumberFormatParams {
  currency: string;
}

export enum EHeaderFormatType {
  SHORTDATE = 'mm/dd/yy',
  MEDIUMDATE = 'M d, yy',
  LONGDATE = 'MM d, yy',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  DECIMAL = 'decimal',
}
