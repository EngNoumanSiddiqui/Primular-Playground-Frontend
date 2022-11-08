export interface IUserInfo {
  id: number;
  username: string;
  isADUser: boolean;
  token: string;
  activities: string[];
  roles: IUserRole[];
}

export interface IUserRole {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface IPermission {
  type: EPermissionType;
  roles: string[];
}

export enum EPermissionType {
  EDIT = 'edit',
  VIEW = 'view',
  DELETE = 'delete',
  ADDROW = 'addRow',
}
