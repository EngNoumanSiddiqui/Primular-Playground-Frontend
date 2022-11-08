import { Injectable } from '@angular/core';
import { EGridColumnType, ISidebar } from '../models';
import { RequestService } from './request.service';
@Injectable({
  providedIn: 'root',
})
export class HyperlinkService {
  constructor(private requestService: RequestService) {}

  buildUrl(linkIds: any, params: { [key: string]: string }) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(linkIds)) {
        this.requestService
          .get<any, any>('/Link/ByLinkIds', { linkIds: linkIds })
          .subscribe(
            (res: any) => {
              if (res) {
                return resolve(res);
              } else {
                return resolve('');
              }
            },
            ({ error }) => {
              console.log('error in getting link info:', error);
              reject(error);
            }
          );
      } else {
        this.requestService
          .getOne<any, any>('/Link/ByLinkId', linkIds)
          .subscribe(
            (response) => {
              if (response) {
                return resolve(this.setUrl(params, response));
              } else {
                return resolve('');
              }
            },
            ({ error }) => {
              console.log('error in getting link info:', error);
              reject(error);
            }
          );
      }
    });
  }

  setUrl(params: { [key: string]: string }, response: any) {
    let url: string = response.url;
    for (let paramKey in params) {
      const lowerKey = paramKey.toLowerCase();
      const paramValue = params[paramKey];
      if (
        url &&
        url.search &&
        url.search(lowerKey) > 0 &&
        paramValue &&
        paramValue.length > 0
      ) {
        url = url.replace('{{' + /lowerKey/gi + '}}', params[paramKey]);
      }
    }
    return url;
  }

  async addHyperlinks(columns: any) {
    let linkIds = [];
    let params: any;
    if (columns && Array.isArray(columns)) {
      columns.forEach((column) => {
        if (
          (column.type === EGridColumnType.LINK ||
            column.type === EGridColumnType.IFRAME) &&
          column.linkId &&
          column.params
        ) {
          linkIds.push(column.linkId);
          params = column.params;
        }
      });
      return await this.buildUrl(linkIds, params).then((res: any) => {
        return res;
      });
    } else if (columns.linkId) {
      linkIds.push(columns.linkId);
      params = columns.params;
      return await this.buildUrl(linkIds, params).then((res: any) => {
        return res;
      });
    }
  }

  setSidebarLink(response: any, sidebar: ISidebar[]) {
    response.forEach((res) => {
      sidebar.forEach((item) => {
        if (item.onClick && item.linkId && item.linkId === res.linkId) {
          item.onClick(res.url);
        }
      });
    });
  }
}
