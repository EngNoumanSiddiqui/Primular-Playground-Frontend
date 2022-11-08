import { IGridFilter, IGridSort } from '@churchillliving/se-ui-toolkit';

export interface ITable {
  values: any;
  priority: number;
}

export interface RequestDto {
  uniqueKey: string;
  filters?: IGridFilter[];
  pageSize?: number;
  page?: number;
  sorts?: IGridSort[];
  tables?: ITable[];
}
