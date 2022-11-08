import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { AlertService } from 'src/app/services/alert.service';
import {
  EValidator,
  IFormField,
  EFormControl,
  AddFormField,
  IDropDownRequest,
  IListFilter,
  ISetFilter,
} from '../models/form.model';
import { HyperlinkService } from '../services/hyperlink.service';
import { DropdownService } from './dropdown.service';
import { IGridSort } from '../models/grid.model';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private hyperlinkService: HyperlinkService,
    private dropdownService: DropdownService,
    private alertService: AlertService,
    private requestService: RequestService
  ) {}

  checkValidity(formFields: IFormField[]): boolean {
    let isValid: boolean = true;

    formFields.map((item: IFormField) => {
      if (item.validations) {
        item.errorMessage = '';
        item.isvalid = true;
        console.log('isValid 1? ', isValid);
        console.log('itemValidations: ', item.validations);
        console.log('item.value: ', item.value);
        console.log('item: ', item);
        for (let i = 0; i < item.validations.length; i++) {
          if (
            item.control === EFormControl.LOOKUP_INPUT &&
            item.value &&
            typeof item.value === 'object'
          ) {
            item.value = item.value.value;
          }
          const valid =
            item.validations && typeof item.label === 'object'
              ? item.label.name
              : item.label;
          if (
            item.validations[i].type == EValidator.REQUIRED &&
            !item.value &&
            !item.hidden &&
            valid
          ) {
            isValid = item.value
              ? true
              : this.setErrorMessage(item, `${valid} is required`);
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.MINLENGTH &&
            item.value.length < item.validations[i].expression
          ) {
            isValid =
              item.value && item.value.length > item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Minimum ${item.validations[i].expression} characters required`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.MAXLENGTH &&
            item.value.length > item.validations[i].expression
          ) {
            isValid =
              item.value && item.value.length < item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Maximum ${item.validations[i].expression} characters required`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.MINIMUM &&
            item.value < item.validations[i].expression
          ) {
            isValid =
              item.value && item.value.length > item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Minimum ${valid} ${item.validations[i].expression}`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.MAXIMUM &&
            item.value > item.validations[i].expression
          ) {
            isValid =
              item.value && item.value.length < item.validations[i].expression
                ? true
                : this.setErrorMessage(
                    item,
                    `Maximum ${valid} ${item.validations[i].expression}`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.PATTERN &&
            !item.value.match(item.validations[i].expression)
          ) {
            isValid =
              item.value && item.value.match(item.validations[i].expression)
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.NUMERIC &&
            !item.value.toString().match(/^(0|[-()1-9]\d*)$/)
          ) {
            isValid =
              item.value && item.value.match(/^(0|[1-9]\d*)$/)
                ? true
                : this.setErrorMessage(
                    item,
                    `Enter ${item.validations[i].type} for ${valid}`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.PHONE &&
            !item.value.toString().match(/^(?=.*[0-9])[-()0-9\s]+$/)
          ) {
            isValid =
              item.value &&
              item.value.toString().match(/^(?=.*[0-9])[-()0-9\s]+$/)
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.DECIMAL &&
            !item.value.match(/^(0|[-()1-9]\d*)(\.\d+)?$/)
          ) {
            isValid =
              item.value && item.value.match(/^(0|[1-9]\d*)(\.\d+)?$/)
                ? true
                : this.setErrorMessage(
                    item,
                    `Enter ${item.validations[i].type} for ${valid}`
                  );
            break;
          } else if (
            item.value &&
            item.validations[i].type == EValidator.EMAIL &&
            !item.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
          ) {
            isValid =
              item.value &&
              item.value.match(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
              )
                ? true
                : this.setErrorMessage(item, `Enter valid ${valid}`);
            break;
          }
        }
      }
    });
    console.log('isValid? ', isValid);
    return isValid;
  }

  setErrorMessage(item: IFormField, errorMessage: string): boolean {
    item.errorMessage = errorMessage;
    item.isvalid = false;
    return false;
  }

  addFormField(fieldInfo: AddFormField): IFormField {
    if (!fieldInfo.label) {
      fieldInfo.label = fieldInfo.field;
    }

    const formField: IFormField = {
      label: fieldInfo.label,
      field: fieldInfo.field,
      displayField: fieldInfo.displayField,
      control: fieldInfo.control,
      row: fieldInfo.row,
      column: fieldInfo.column,
      value: fieldInfo.value,
      format: fieldInfo.format,
      hidden: fieldInfo.hidden,
      permissions: fieldInfo.permissions,
      validations: fieldInfo.validations,
      hyperlink: fieldInfo.hyperlink,
      data: fieldInfo.data,
      lookupControl: fieldInfo.lookupControl,
      componentControl: fieldInfo.componentControl,
      onClick: fieldInfo.onClick,
      onReturn: fieldInfo.onReturn,
      onFocusOut: fieldInfo.onFocusOut,
      tables: fieldInfo.tables,
      disabled: fieldInfo.disabled,
      disabledText: fieldInfo.disabledText,
      optionLabel: fieldInfo.optionLabel,
      optionValue: fieldInfo.optionValue,
      monthOnly: fieldInfo.monthOnly,
      showTime: fieldInfo.showTime, // to show time as well in calendar form field
      timeOnly: fieldInfo.timeOnly,
      height: fieldInfo.height,
      showBottomBorder: fieldInfo.showBottomBorder,
      allowSearch: fieldInfo.allowSearch,
      selectMultipleFiles: fieldInfo.selectMultipleFiles,
      SetfileTypes: fieldInfo.SetfileTypes,
      icon: fieldInfo.icon,
      color: fieldInfo.color,
      card: fieldInfo.card,
    };

    return formField;
  }

  addCheckbox(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.CHECKBOX;
    return this.addFormField(fieldInfo);
  }

  addTextbox(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.INPUT;
    return this.addFormField(fieldInfo);
  }

  addDisplayField(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.INPUT;
    fieldInfo.disabled = true;
    fieldInfo.showBottomBorder = true;
    return this.addFormField(fieldInfo);
  }

  addNumericTextbox(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.NUMERIC;
    return this.addFormField(fieldInfo);
  }

  addSpaceField(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.SPACER;
    return this.addFormField(fieldInfo);
  }

  addTextArea(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.TEXTAREA;
    return this.addFormField(fieldInfo);
  }

  addNoteField(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.NOTE_FIELD;
    return this.addFormField(fieldInfo);
  }

  addHyperlink(fieldInfo: AddFormField) {
    if (fieldInfo.hyperlink && fieldInfo.hyperlink.component) {
      fieldInfo.control = EFormControl.HYPERLINK;
      return this.addFormField(fieldInfo);
    } else {
      return this.hyperlinkService
        .buildUrl(fieldInfo.hyperlink.linkId, fieldInfo.hyperlink.params)
        .then((res: any) => {
          if (
            fieldInfo.hyperlink.linkId &&
            fieldInfo.hyperlink.linkId.length > 0
          ) {
            fieldInfo.hyperlink.link = res;
          }
          fieldInfo.control = EFormControl.HYPERLINK;
          let obj = this.addFormField(fieldInfo);
          obj['orignalLink'] = res;
          return obj;
        });
    }
  }

  addCalendar(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.CALENDAR;
    return this.addFormField(fieldInfo);
  }

  // add AutoComplete for Form
  addAutoComplete(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.AUTOCOMPLETE;
    return this.addFormField(fieldInfo);
  }

  // Search AutoComplete Data for form
  getAutoCompleteData(
    formField?: IFormField,
    uniqueKey?: string,
    filters?: any[]
  ): any {
    this.requestService
      .get<any[], any>('/Data/Fetch', { uniqueKey: uniqueKey, filters })
      .subscribe((response) => {
        formField.data = [...response.records];
      });
  }

  addDropdown(fieldInfo?: AddFormField, dropDownProp?: IDropDownRequest): any {
    fieldInfo.control = EFormControl.DROPDOWN;
    if (dropDownProp) {
      let uniqueKey = dropDownProp.uniqueKey;
      let valueProp = dropDownProp.valueProp;
      let labelProp = dropDownProp.labelProp;
      let filters: ISetFilter[] =
        dropDownProp.filters && dropDownProp.filters.length > 0
          ? dropDownProp.filters
          : [];
      if (uniqueKey && valueProp && labelProp) {
        return this.getDropdownData(
          fieldInfo,
          uniqueKey,
          valueProp,
          labelProp,
          filters
        );
      }
    } else {
      return this.addFormField(fieldInfo);
    }
  }

  getDropdownData(
    fieldInfo,
    uniqueKey: string,
    valueProp: string,
    labelProp: string,
    filters
  ) {
    return this.dropdownService
      .setDropDownList(uniqueKey, valueProp, labelProp, filters)
      .then((res: any) => {
        fieldInfo.data = res;
        return this.addFormField(fieldInfo);
      })
      .catch((error) => {
        this.alertService.apiError(error);
        return this.addFormField(fieldInfo);
      });
  }

  addLookUp(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.LOOKUP_INPUT;

    return this.addFormField(fieldInfo);
  }

  addDialog(fieldInfo: AddFormField): IFormField {
    return this.addLookUp(fieldInfo);
  }

  addComponent(fieldInfo: AddFormField): IFormField {
    fieldInfo.control = EFormControl.COMPONENT;
    return this.addFormField(fieldInfo);
  }

  addHeader(fieldInfo: IFormField): IFormField {
    fieldInfo.control = EFormControl.SECTION_HEADER;
    return this.addFormField(fieldInfo);
  }

  addFileUpload(fieldInfo: IFormField): IFormField {
    fieldInfo.control = EFormControl.FILE_UPLOAD;
    return this.addFormField(fieldInfo);
  }

  addDisplayFile(fieldInfo: IFormField): IFormField {
    fieldInfo.control = EFormControl.DISPLAY_FILE;
    return this.addFormField(fieldInfo);
  }

  // Adding OnClick Button Function for DynamicForm
  addButton(fieldInfo: IFormField): IFormField {
    fieldInfo.control = EFormControl.ADD_BUTTON;
    return this.addFormField(fieldInfo);
  }

  // Adding Switch Function for DynamicForm
  addSwitch(fieldInfo: IFormField): IFormField {
    fieldInfo.control = EFormControl.SWITCH;
    return this.addFormField(fieldInfo);
  }

  // start add new card functionality
  addCard(fieldInfo: IFormField, cardData?: IListFilter): IFormField {
    fieldInfo.control = EFormControl.CARD;
    if (cardData && cardData.uniqueKey) {
      return this.getCardData(
        fieldInfo,
        cardData.uniqueKey,
        cardData.filters,
        cardData.sorts
      );
    } else {
      return this.addFormField(fieldInfo);
    }
  }

  getCardData(
    fieldInfo: any,
    uniqueKey: string,
    filters: any[] = [],
    sorts: any[] = []
  ): any {
    return this.getCardList(uniqueKey, filters, sorts)
      .then((res: any) => {
        fieldInfo.card.data = res.records;
        return this.addFormField(fieldInfo);
      })
      .catch((error) => {
        this.alertService.apiError(error);
      });
  }

  getCardList(uniqueKey: string, filters: any[] = [], sorts: any[] = []) {
    return new Promise((resolve, reject) => {
      this.requestService
        .get<any[], any>('/Data/Fetch', {
          uniqueKey: uniqueKey,
          filters,
          sorts,
        })
        .subscribe(
          (response) => {
            if (response) {
              return resolve(response);
            } else {
              return resolve([]);
            }
          },
          ({ error }) => {
            reject(error);
          }
        );
    });
  }

  // End add new card functionality
}
