import { Type } from '@angular/core';
import { IPermission } from './user-info.model';

export const ESideBar = {
  LEFT: 'left-sidebar',
  RIGHT: 'right-sidebar',
};

export interface ISidebar {
  icon: string;
  action?: string;
  section: string;
  component?: Type<any>;
  [key: string]: any;
  data?: IData;
  onReturn?: (data) => any;
  onClick?: (value: any) => void;
  permissions?: IPermission[];
  disabled?: boolean;
  hidden?: boolean;
  id?: string;
  tooltip?: string;
  iFrame?: IFrame;
  linkId?: string;
  params?: any;
}

export enum ESidebarAction {
  NAVIGATION = 'navigation',
  OPENDIALOG = 'dialog',
  IFRAME = '_iframe',
}

export interface IFrame {
  link?: string;
  width?: string;
  height?: string;
}

export interface IData {
  header?: string;
  width?: string;
  data?: any;
}
