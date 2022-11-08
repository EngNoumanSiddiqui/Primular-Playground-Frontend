import { IPermission } from './user-info.model';
import { MenuItem } from 'primeng/api/menuitem';

export interface IMenu extends MenuItem {
  permissions?: IPermission[];
  hidden?: boolean;
  items?: IMenu[];
}
