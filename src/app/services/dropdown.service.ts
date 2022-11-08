import { Injectable } from '@angular/core';
import { ISelectItem } from 'src/app/models/grid.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private requestService: RequestService) {}

  /**
   * Function to set the values for dropdown
   * @param response array of data
   * @param valueProp    property name for value
   * @param labelProp    property name for label
   */
  setDropDownList(
    uniqueKey: any,
    valueProp: string,
    labelProp: string,
    filters: any[] = []
  ) {
    let dropdownvalues: ISelectItem[] = [];
    return new Promise((resolve, reject) => {
      this.requestService
        .get<any[], any>('/Data/Fetch', { uniqueKey: uniqueKey, filters })
        .subscribe(
          (response) => {
            if (response) {
              dropdownvalues = this.setDropDown(
                response,
                valueProp.toLowerCase(),
                labelProp.toLowerCase()
              );
              return resolve(dropdownvalues);
            } else {
              return resolve('');
            }
          },
          ({ error }) => {
            console.log('error in setting dropdown list:', error);
            reject(error);
          }
        );
    });
  }

  setDropDown(response: any, valueProp: string, labelProp: string) {
    if (valueProp) valueProp = valueProp.toLowerCase();
    if (labelProp) labelProp = labelProp.toLowerCase();
    let dropdownvalues: ISelectItem[] = [];
    if (response.records) {
      this.setDataFields(response.records).forEach((record) => {
        if (
          record.hasOwnProperty(valueProp && labelProp) &&
          record[valueProp] &&
          record[labelProp]
        ) {
          dropdownvalues.push({
            label: record[labelProp].toString().trim(),
            value: record[valueProp].toString().trim(),
          });
        }
      });
    }
    return dropdownvalues;
  }

  setDataFields(response: any[]) {
    let data: any = [];
    if (response && response.length > 0) {
      response.map((x: any) => {
        const result = Object.keys(x).reduce(
          (prev, current) => ({ ...prev, [current.toLowerCase()]: x[current] }),
          {}
        );
        data.push(result);
      });
    }
    return data;
  }
}
