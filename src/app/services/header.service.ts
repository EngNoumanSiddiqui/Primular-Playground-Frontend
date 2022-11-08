import { Injectable } from '@angular/core';
import { EFormControl } from '../models/form.model';
import { AddHeaderField, IHeaderField } from '../models/header.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor() {}

  addHeaderField(headerInfo: AddHeaderField): IHeaderField {
    if (!headerInfo.column) {
      headerInfo.column = 3;
    }

    const headerField: IHeaderField = {
      label: headerInfo.label,
      control: headerInfo.control,
      value: headerInfo.value,
      column: headerInfo.column,
      data: headerInfo.data,
      class: headerInfo.class,
      onClick: headerInfo.onClick,
      hyperlink: headerInfo.hyperlink,
      disabled: headerInfo.disabled,
      hidden: headerInfo.hidden,
      permissions: headerInfo.permissions,
      format: headerInfo.format,
      showTime: headerInfo.showTime,
      timeOnly: headerInfo.timeOnly,
    };
    return headerField;
  }

  addLabel(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.LABEL;
    return this.addHeaderField(headerInfo);
  }

  addDropdown(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.DROPDOWN;
    return this.addHeaderField(headerInfo);
  }

  addButton(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.BUTTON;
    return this.addHeaderField(headerInfo);
  }

  addCheckbox(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.CHECKBOX;
    return this.addHeaderField(headerInfo);
  }

  addHyperlink(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.HYPERLINK;
    return this.addHeaderField(headerInfo);
  }

  addCalendar(headerInfo: AddHeaderField): IHeaderField {
    headerInfo.control = EFormControl.CALENDAR;
    return this.addHeaderField(headerInfo);
  }
}
