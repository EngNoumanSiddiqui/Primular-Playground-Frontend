import { formatDate } from '@angular/common';
import { ISidebar } from '../models/sidebar.model';
import { IDictionary, IFilterDictionary } from '../models';
import {
  EFormatType,
  EFormControl,
  EHyperlink,
  IDynamicForm,
  IFormat,
  IFormField,
  IFormSection,
} from '../models/form.model';
import {
  addGlobalFilter,
  IGlobalFilter,
  IGridFilter,
} from '../models/grid.model';
import { Subject } from 'rxjs';
import { EGridColumnType, IGridColumn } from '../models/grid.model';
import { IDynamicCard } from '@churchillliving/se-ui-toolkit';

/* #region public methods */

var formstate = new Subject<any>();

export function changeDynamicFormState(id: any, data: any) {
  formstate.next({ id, data });
}

export function onDynamicFormStateChange() {
  return formstate.asObservable();
}

/**
 *
 * @param value : any
 * Function receives the value and expects the value to be formated.
 * Do not use fat arrow function as they do not preserve the context.
 * this.value refers to the value of IFormField Object
 * Modify this.value directly to receive effect
 */
export function toDecimal(value: any): any {
  if (value) {
    return parseFloat(value.toString()).toFixed(2);
  }
}

export function toBoolean(value: any) {
  return value === 'Y' ? true : false;
}

export function closeIFrame() {
  let close = window.parent.document.querySelector(
    '.p-dialog-header-icon'
  ) as HTMLElement;
  if (close) {
    close.click();
  }
}

export function toShortDate(value: any, format?: IFormat) {
  if (value && value !== '') {
    if (
      format &&
      (format.type === EFormatType.LONGDATE ||
        format.type === EFormatType.MEDIUMDATE)
    ) {
      return value;
    } else {
      return formatDate(value, 'MM/dd/yyyy', 'en-US');
    }
  } else {
    return null;
  }
}

export function toShortDateTime(value: any, format?: IFormat) {
  if (value && value !== '') {
    if (
      format &&
      (format.type === EFormatType.LONGDATE ||
        format.type === EFormatType.MEDIUMDATE)
    ) {
      return value;
    } else {
      return formatDate(value, 'MM/dd/yyyy hh:mm a', 'en-US');
    }
  } else {
    return null;
  }
}

export function toTrim(text: any) {
  if (typeof text === 'string') {
    return text.trim();
  } else {
    return text;
  }
}

export function getMatchKey(obj: any, propName: string): string {
  if (!obj || !propName) {
    return '';
  }

  let matchedKey = '';
  if (Array.isArray(obj)) {
    obj.forEach((row) => {
      const keys: string[] = Object.keys(row);
      if (!matchedKey || matchedKey.length === 0) {
        matchedKey = keys.find(
          (x) => x.toLowerCase() === propName.toLowerCase()
        );
      }
    });
  } else {
    const keys: string[] = Object.keys(obj);
    matchedKey = keys.find((x) => x.toLowerCase() === propName.toLowerCase());
  }

  return matchedKey;
}

export function formatFormFieldValue(formField: IFormField, value: any): any {
  let formattedValue: any = value;
  if (formField.format) {
    switch (formField.format.type) {
      case EFormatType.DECIMAL:
        formattedValue = toDecimal(value);
        break;
      case EFormatType.BOOLEAN_YN:
        formattedValue = toBoolean(value);
        break;
      case EFormatType.SHORTDATE:
        formattedValue = toShortDate(value);
        break;
      case EFormatType.CUSTOM:
        if (formField.format.formatter) {
          formattedValue = formField.format.formatter(value);
        }
        break;
      default:
        break;
    }
  }
  return formattedValue;
}

export function setFormField(
  { formSections }: IDynamicForm,
  formFieldObj: IFormField
) {
  return formSections?.map((section) => {
    return (section.fields = section.fields.map((formField: IFormField) => {
      if (
        formField.field?.toLowerCase() === formFieldObj.field?.toLowerCase() ||
        (formField.label && formField.label === formFieldObj.label)
      ) {
        formField = formFieldObj;
      }
      return formField;
    }));
  });
}

export function setHyperlinkComponentData(
  { formSections }: IDynamicForm,
  label: string,
  data: any
) {
  formSections.forEach((section) => {
    let field = section.fields.find(
      (field) => field.label && field.label === label
    );
    if (field) field.hyperlink.params = data;
  });
}

export function setLookupData(
  { formSections }: IDynamicForm,
  field: string,
  data: any
) {
  formSections.map((section: IFormSection) => {
    section.fields.map((formField: IFormField) => {
      if (formField.field?.toLowerCase() === field?.toLowerCase()) {
        if (
          formField.label &&
          formField.label.labelControl &&
          formField.label.labelControl.lookupControl &&
          formField.label.labelControl.lookupControl.data &&
          data
        ) {
          formField.label.labelControl.lookupControl.data.data = data;
        }
        if (formField.lookupControl && formField.lookupControl.data && data) {
          formField.lookupControl.data.data = data;
        }
      }
    });
  });
  return formSections;
}

export function setLinkParamValues(
  { formSections }: IDynamicForm,
  field: string,
  params: any[]
) {
  return formSections?.map((section: IFormSection) => {
    return section.fields.map((formField: IFormField) => {
      const isLabelLink =
        formField.label && typeof formField.label === 'object';
      if (
        formField.field?.toLowerCase() === field?.toLowerCase() ||
        (isLabelLink &&
          formField.label?.name?.toLowerCase() === field?.toLowerCase()) ||
        (formField.label &&
          typeof formField.label === 'string' &&
          formField.label?.toLowerCase() === field?.toLowerCase())
      ) {
        let newLink: string = isLabelLink
          ? formField.label?.labelControl?.orignalLink
          : formField.hyperlink?.link;
        if (newLink && newLink.length > 0) {
          return params.map((paramObj: IDictionary) => {
            if (
              (typeof paramObj.value === 'object' && paramObj.value) ||
              (typeof paramObj.value === 'string' && paramObj.value?.length > 0)
            ) {
              // removing https:// or http:// from hyperlink param value
              if (
                (paramObj.value?.toString().includes('https://') ||
                  paramObj.value?.toString().includes('http://')) &&
                (newLink.includes('https://') || newLink.includes('http://'))
              ) {
                paramObj.value = paramObj.value
                  .replace('https://', '')
                  .replace('http://', '');
              }
              const paramName: string = paramObj.name;
              const paramFormat: string = !paramObj.value
                ? '{{' + paramName + '}}'
                : paramName;
              if (newLink.localeCompare(paramFormat)) {
                let setLink =
                  paramFormat !== '{{' + paramFormat + '}}'
                    ? '{{' + paramFormat + '}}'
                    : paramFormat;

                newLink = newLink.replace(
                  new RegExp(setLink, 'ig'),
                  toTrim(paramObj.value)
                );

                if (newLink && !newLink.startsWith('http')) {
                  newLink = 'http://' + newLink;
                }
              }
              return isLabelLink
                ? (formField.label.labelControl.hyperlink.link = newLink)
                : (formField.hyperlink.link = newLink);
            }
          });
        }
      }
    });
  });
}

export function getFormFieldValueAsString(
  dynamicForm: IDynamicForm,
  field: string
): string {
  let value: any = getFormFieldValue(dynamicForm, field, true);
  if (value) {
    value = value.toString();
  }
  return value;
}

export function setAddComponentData(
  { formSections }: IDynamicForm,
  id: string,
  value: any
) {
  formSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (
        field.control === EFormControl.COMPONENT &&
        field.componentControl &&
        field.componentControl.id === id
      ) {
        let keys = Object.keys(value);
        keys.forEach((key) => {
          field.componentControl.data = {
            ...field.componentControl.data,
            [key]: value[key],
          };
          changeDynamicFormState(id, field.componentControl.data);
        });
      }
    });
  });
}

export function setSidebarLinkParamValues(link: string, params: any[]): string {
  let newLink: string = link;
  if (params && params.length > 0) {
    params.map((param) => {
      const url = param.name ? '{{' + param.name + '}}' : '';
      if (newLink.localeCompare(url)) {
        newLink = newLink.replace(new RegExp(url, 'ig'), toTrim(param.value));
      }
    });
  }
  return newLink;
}

export function setFormPropValues(
  { formSections }: IDynamicForm,
  field: string,
  props: IDictionary[]
) {
  return formSections?.map((section: IFormSection) => {
    return section.fields.map((formField: IFormField) => {
      if (
        formField.field?.toLowerCase() === field?.toLowerCase() ||
        (formField.label &&
          formField.label.toString().toLowerCase() === field?.toLowerCase())
      ) {
        return props.map((prop: IDictionary) => {
          if (formField.hasOwnProperty(prop.name)) {
            return (formField[prop.name] = prop.value);
          }
        });
      }
    });
  });
}

export function setSidebarPropValues(
  sidebar: ISidebar[],
  section: string,
  props: IDictionary[]
) {
  sidebar.map((sidebarItem: any) => {
    if (sidebarItem.section?.toLowerCase() === section.toLowerCase()) {
      props.map((prop) => {
        if (prop.name?.toLowerCase() === 'data' && sidebarItem.data?.data) {
          sidebarItem.data.data = prop.value;
        } else {
          return setPropValue(sidebarItem, prop);
        }
      });
    }
  });
}

export function setSectionPropValues(
  { formSections }: IDynamicForm,
  sectionName: string,
  props: IDictionary[]
) {
  formSections.map((section) => {
    if (section.name?.toLowerCase() === sectionName.toLowerCase()) {
      props.map((prop) => {
        return setPropValue(section, prop);
      });
    }
  });
}

export function setFormFields(
  { formSections }: IDynamicForm,
  formFields: IFormField[]
) {
  return formSections?.map((section) => {
    return (section.fields = section.fields.map((formField) => {
      let matchedField = formFields.find(
        (x) => x.field?.toLowerCase() == formField.field?.toLowerCase()
      );
      if (matchedField) {
        formField = matchedField;
      }
      return formField;
    }));
  });
}

export function setFormFieldValue(
  { formSections }: IDynamicForm,
  field: string,
  value: any,
  displayText: string = ''
) {
  formSections?.forEach((section) => {
    section.fields.forEach((formField) => {
      if (formField.field?.toLowerCase() === field?.toLowerCase()) {
        if (displayText && displayText.length > 0) {
          formField.value = { text: displayText, value: value };
        } else {
          formField.value = value;
        }
      }
    });
  });
}

export function getFormFields(
  { formSections }: IDynamicForm,
  formControl: EFormControl
): IFormField[] {
  let formFields: IFormField[] = [];
  formSections?.forEach((section) => {
    section.fields.forEach((formField) => {
      if (formField.control === formControl) {
        formFields.push(formField);
      }
    });
  });
  return formFields;
}

export function getFormField(
  { formSections }: IDynamicForm,
  field: string
): IFormField {
  let formFieldObj: any;
  formSections?.forEach((section) => {
    section.fields.forEach((formField) => {
      if (formField.field?.toLowerCase() === field?.toLowerCase()) {
        formFieldObj = formField;
      }
    });
  });
  return formFieldObj;
}

export function getGlobalFilters(
  globalFilters: addGlobalFilter[],
  field: string
) {
  let formFieldObj: any;
  globalFilters.map((filter) => {
    if (filter.field?.toLowerCase() === field?.toLowerCase()) {
      formFieldObj = filter;
    }
  });
  return formFieldObj;
}

export function getFormFieldValue(
  { formSections }: IDynamicForm,
  field: string,
  returnDisplayValue: boolean = false
) {
  let value;
  for (const section of formSections as any) {
    section.fields.forEach((formField: any) => {
      if (formField.field?.toLowerCase() === field?.toLowerCase()) {
        let isValid =
          returnDisplayValue === true && typeof formField.value === 'object';
        if (
          formField.control === EFormControl.LOOKUP_INPUT &&
          formField.displayField
        ) {
          value = isValid ? formField.value?.text : formField.value?.value;
        } else {
          value = isValid
            ? formField.value?.text
            : formField.value === 'object' && !returnDisplayValue
            ? formField.value?.value
            : formField.value;
        }
      }
    });
  }
  return value;
}

export function getSectionFieldValue(
  formSections: IFormSection[],
  field: string
) {
  let form: IDynamicForm = { formSections };
  return getFormFieldValue(form, field, true);
}

export function setSaveFormValues(
  formSections: IFormSection[],
  tables?: string[]
) {
  let response: any = {};
  if (tables && tables.length > 0) {
    tables.forEach((tableName) => {
      formSections.forEach((formSection) => {
        const sectionFields = formSection.fields?.filter(
          (x) => x.control !== EFormControl.CARD
        );

        sectionFields?.forEach((field) => {
          const table = field.tables?.map((table) => table.toLowerCase());

          if (table && table.includes(tableName.toLowerCase())) {
            if (!response[tableName]) {
              response[tableName] = {};
            }

            if (field.field && field.field.length > 0) {
              response[tableName][field.field] = formatFormFieldCValue(field);
            }
          }
        });
      });
    });
  } else {
    formSections.forEach((formSection) => {
      const sectionFields = formSection.fields?.filter(
        (x) => x.control !== EFormControl.CARD
      );
      sectionFields?.forEach((field) => {
        if (field.field && field.field.length > 0) {
          response[field.field] = formatFormFieldCValue(field);
        }
      });
    });
  }

  return response;
}

export function setSaveCardValues(
  formSections: IFormSection[],
  tables?: string[]
) {
  let values: IFormField[] = [];
  formSections?.forEach((section) => {
    section.fields?.forEach((field) => {
      if (field.control === EFormControl.CARD && field.card.data) {
        field.card.data.forEach((cardData) => {
          if (cardData.dynamicForm.formSections) {
            values.push(
              setSaveFormValues(cardData.dynamicForm.formSections, tables)
            );
          }
        });
      }
    });
  });
  return values;
}

export function setEditFormFields(data: any, dynamicForm: IDynamicForm) {
  if (data && data.length > 0 && Array.isArray(data)) {
    data.forEach((dataRow) => {
      setEditFormFieldsInfo(dataRow, dynamicForm, data);
    });
  } else {
    setEditFormFieldsInfo(data, dynamicForm);
  }
}

export function setFilter(
  field: string,
  value: any,
  matchMode: string,
  operator: string,
  valueField: string
) {
  const filter: any = {
    field: field,
    valueField: valueField,
    matchMode: matchMode,
    operator: operator,
    value: typeof value === 'object' ? value?.value : value,
  };
  return filter;
}

export function setAndFilter(field: string, value: any, valueField?: string) {
  return setFilter(field, value, 'equals', 'and', valueField);
}

export function getOrigDataFieldValue(data: any, propName: string): any {
  let value: any;
  if (data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        value = getPropertyValue(data[i], propName);
        if (value) {
          return value;
        }
      }
    } else {
      value = getPropertyValue(data, propName);
    }
  }
  return value;
}

export function getOrigDataFieldValueAsString(
  data: any,
  propName: string
): string {
  let value = getOrigDataFieldValue(data, propName);
  if (value) {
    return value.toString();
  } else {
    return '';
  }
}

/* #endregion */

/* #region private methods */

function setEditFormFieldsInfo(
  data: any,
  dynamicForm: IDynamicForm | IDynamicCard,
  allData: any[] = []
) {
  if (data.records && data.records.length > 0) {
    data.records.forEach((record) => {
      const keys: string[] = Object.keys(record);
      dynamicForm.formSections?.forEach((formSection) => {
        if (formSection.fields) {
          formSection.fields.forEach((formField: IFormField) => {
            const matchedKey: string = keys.find(
              (x) => x.toLowerCase() === formField.field?.toLowerCase()
            );

            if (matchedKey) {
              // set label hyperlink
              setLabelHyperlink(formField, record, keys, allData);
            }

            if (
              formField.control === EFormControl.HYPERLINK &&
              formField.hyperlink &&
              ((formField.hyperlink.linkId && formField.hyperlink.params) ||
                formField.hyperlink.link)
            ) {
              let params = formField.hyperlink.params;
              let paramKeys: string[] = [];

              if (
                !params &&
                formField.hyperlink.link &&
                formField.hyperlink.link.includes('}}')
              ) {
                paramKeys = formField.hyperlink.link.split('}}');
                paramKeys = paramKeys.map((paramKey) => {
                  paramKey = paramKey.replace('{{', '').trim();
                  return paramKey;
                });
                paramKeys = paramKeys.filter((x) => x.length > 0);
              } else {
                if (params) {
                  paramKeys = Object.keys(params);
                }
              }

              formField.hyperlink.link = setHyperlink(
                keys,
                record,
                formField.hyperlink.link,
                paramKeys,
                formField.hyperlink.params,
                allData
              );
            } else {
              if (formField.control === EFormControl.CALENDAR && matchedKey) {
                formField.value = record[matchedKey]
                  ? new Date(record[matchedKey] as string)
                  : '';
              } else if (formField.control === EFormControl.CARD) {
                if (formField.card && formField.card.formSections) {
                  if (!formField.card.data) {
                    formField.card.data = data;
                  }

                  setEditFormFieldsInfo(data, formField.card);
                }
              } else if (
                formField.control === EFormControl.AUTOCOMPLETE &&
                matchedKey
              ) {
                let arrayValue = [];
                if (record[matchedKey]) {
                  arrayValue.push(record[matchedKey]);
                }
                formField.value = arrayValue;
              } else if (formField.control === EFormControl.LOOKUP_INPUT) {
                if (
                  formField.label &&
                  formField.label.labelControl &&
                  formField.label.labelControl.lookupControl &&
                  formField.label.labelControl.lookupControl.data
                ) {
                  const obj = autoSetLookupData(
                    formField.label.labelControl.lookupControl.data.data,
                    record
                  );
                  if (obj) {
                    formField.label.labelControl.lookupControl.data.data = obj;
                  }
                }

                if (
                  formField.lookupControl &&
                  formField.lookupControl.data &&
                  formField.lookupControl.data.data
                ) {
                  const obj = autoSetLookupData(
                    formField.lookupControl.data.data,
                    record
                  );
                  if (obj) {
                    formField.lookupControl.data.data = obj;
                  }
                }
                if (record[matchedKey]) {
                  formField.value = toTrim(record[matchedKey]);
                }
                if (
                  formField.displayField &&
                  formField.displayField.length > 0
                ) {
                  const matchDisplayField = getMatchKey(
                    record,
                    formField.displayField
                  );
                  if (matchDisplayField) {
                    formField.value = {
                      text: toTrim(record[matchDisplayField]),
                      value: formField.value?.value,
                    };
                  }

                  const valuelabelMatch = getMatchKey(record, formField.field);
                  if (valuelabelMatch) {
                    formField.value = {
                      text: formField.value?.text,
                      value: toTrim(record[valuelabelMatch]),
                    };
                  }
                }
              } else if (
                formField.control === EFormControl.COMPONENT &&
                formField.componentControl?.data
              ) {
                formField.componentControl.data = findKeysAndValue(
                  formField.componentControl.data,
                  record
                );
                changeDynamicFormState(
                  formField.componentControl.id,
                  formField.componentControl?.data
                );
              } else if (
                formField.control === EFormControl.NUMERIC &&
                formField.label?.labelControl?.lookupControl?.data?.data
              ) {
                let setData = formField.label.labelControl.lookupControl;
                setData.data.data = findKeysAndValue(setData.data.data, record);
                changeDynamicFormState(setData.id, setData.data.data);
              } else if (
                formField.control === EFormControl.HYPERLINK &&
                formField.hyperlink.target === EHyperlink.DIALOG &&
                formField.hyperlink.params
              ) {
                formField.hyperlink.params = findKeysAndValue(
                  formField.hyperlink.params,
                  record
                );
              } else if (matchedKey) {
                if (formField.format) {
                  formField.value = formatFormFieldValue(
                    formField,
                    record[matchedKey]
                  );
                } else if (formField.control === EFormControl.CHECKBOX) {
                  formField.value =
                    record[matchedKey] &&
                    (record[matchedKey].toString() === '1' ||
                      record[matchedKey].toString() === 'true')
                      ? true
                      : false;
                } else if (formField.control === EFormControl.DROPDOWN) {
                  let dropValue = record[matchedKey];
                  formField.value = dropValue
                    ? dropValue.toString()
                    : dropValue;
                } else {
                  formField.value = toTrim(record[matchedKey]);
                }
              }
            }
          });
        }
      });
    });
  }
}

export function setHyperlinkParamValue(record: any, dynamicForm: IDynamicForm) {
  let keys: string[] = [];
  let link: string = '';
  let paramKeys: string[] = [];
  let param: any;
  let fieldInfo: any;
  dynamicForm.formSections?.forEach((section: any) => {
    section.fields.forEach((formField: any) => {
      if (
        formField.label &&
        formField.label.labelControl &&
        formField.label.labelControl.hyperlink?.link
      ) {
        keys = Object.keys(record);
        if (formField?.label?.labelControl?.orignalLink) {
          link = formField.label.labelControl.orignalLink;
        }

        if (formField?.label?.labelControl?.hyperlink?.params) {
          param = formField.label.labelControl.hyperlink.params;
          paramKeys = Object.keys(param);
        }
        fieldInfo = formField;
        if (record && keys && link && paramKeys && param && fieldInfo) {
          fieldInfo.label.labelControl.hyperlink.link = setHyperlink(
            keys,
            record,
            link,
            paramKeys,
            param
          );
        }
      }
    });
  });
}

export function objConvertToLower(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

export function findKeysAndValue(data, record) {
  Object.keys(data).forEach((dataKey) => {
    let key = Object.keys(record).find(
      (key) => dataKey.toLowerCase() === key.toLowerCase()
    );
    if (key && key.length > 0) {
      data = { ...data, [dataKey]: record[key] };
    }
  });
  return data;
}

export function clickSectionHighlight(value) {
  document.querySelectorAll('.left-sideBar .p-panelmenu .p-panelmenu-panel');
  const title = document.body.querySelector('[title = "' + value.name + '"]');
  const allMenuItems = document.body.querySelectorAll(
    '.left-sideBar .p-panelmenu-panel'
  );
  allMenuItems.forEach((menauItem: any) => {
    menauItem.setAttribute('class', 'p-panelmenu-panel');
  });
  title.parentElement.parentElement.setAttribute(
    'class',
    'p-panelmenu-panel active'
  );
  title.parentElement.setAttribute(
    'class',
    'p-element p-component p-panelmenu-header p-highlight'
  );

  const activeIcon = document.body.querySelectorAll('.active-icon');
  activeIcon.forEach((icon: any, index: any) => {
    icon.setAttribute(
      'class',
      'p-element p-component p-panelmenu-header p-highlight'
    );
  });
}

export function removeActiveIconClass() {
  const activeIcon = document.body.querySelectorAll('.active-icon');
  if (activeIcon && activeIcon.length > 0) {
    activeIcon.forEach((icon: any, index: any) => {
      icon.setAttribute(
        'class',
        'p-element p-component p-panelmenu-header p-highlight'
      );
    });
  }
}

export function highlightLeftSidebar() {
  const formElement = document.getElementsByClassName('form-container');
  if (formElement && formElement[0]) {
    formElement[0].addEventListener('scroll', highlightLeftSidebarIcons, true);
  }
}

function highlightLeftSidebarIcons() {
  const scrollTopPosition: any = document.querySelector('.form-container')
    ?.scrollTop;
  const allIconElements: any = document.body.querySelectorAll(
    '.left-sideBar .p-panelmenu .p-panelmenu-panel'
  );

  allIconElements.forEach((icon: any, index: any) => {
    icon.setAttribute('tabIndex', 'section' + index);
  });
  removeActiveIconClass();
  document
    .querySelectorAll('.form-container .card')
    .forEach((card: any, index: any) => {
      const currentId = 'section' + index;
      if (
        scrollTopPosition >= card.offsetTop &&
        scrollTopPosition <= card.offsetTop + card.offsetHeight
      ) {
        return document.body
          .querySelector('[tabIndex=' + currentId + ']')
          ?.setAttribute('class', 'p-panelmenu-panel active');
      } else {
        return document.body
          .querySelector('[tabIndex=' + currentId + ']')
          ?.setAttribute('class', 'p-panelmenu-panel');
      }
    });
}

export function hasRole(role: string): boolean {
  let storage = localStorage.getItem('CurrentUserInfo');
  if (storage) {
    let currentUser = JSON.parse(storage);
    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
      return currentUser.roles.some(
        (item: any) => item.code.toString().toLowerCase() === role.toLowerCase()
      );
    }
  }
  return false;
}

function setLabelHyperlink(
  item: IFormField,
  record,
  keys: string[],
  allData: any[] = []
) {
  if (item.label?.labelControl && item.label.labelControl?.hyperlink) {
    const paramKeys = Object.keys(item.label.labelControl.hyperlink.params);
    const link = item.label.labelControl.hyperlink.link;
    item.label.labelControl.hyperlink.link = setHyperlink(
      keys,
      record,
      link,
      paramKeys,
      item.label.labelControl.hyperlink.params,
      allData
    );
  }
}

export function setHyperlink(
  keys: string[],
  record: any,
  link: string,
  paramKeys: string[],
  params: any,
  allData: any[] = []
): string {
  let newLink: string = link;
  record = objConvertToLower(record);

  paramKeys.forEach((paramkey) => {
    const param: string = '{{' + paramkey.toLowerCase() + '}}';
    const isParamMatched = newLink.localeCompare(param);
    const paramInRecord = setParamKeyValue(record, allData, paramkey);

    if (isParamMatched) {
      let paramValue = params ? params[paramkey] : null;
      if (paramValue === '' && paramInRecord) {
        paramValue = '{' + paramkey + '}';
      }
      if (paramValue) {
        const propName = paramValue.replace('{', '').replace('}', '');
        let propValue = record[propName.toLowerCase()];

        // in case of prop not found in record then try to find prop in all data array, to get its value
        if (!propValue && allData && allData.length > 0) {
          allData.forEach((data) => {
            //const value = data.records.find((x)=> x[propName]);
            data.records.forEach((allRecord) => {
              let keys = Object.keys(allRecord);
              let matchKey = keys.find(
                (x) => x.toLowerCase() === propName.toLowerCase()
              );
              if (matchKey) {
                propValue = allRecord[matchKey];
              }
            });
          });
        }
        newLink = newLink.replace(
          new RegExp(param, 'ig'),
          toTrim(paramValue.includes('{') ? propValue : paramValue)
        );
      } else {
        // get param value from api response, if param key exists in it
        const matchedKey: string = keys.find(
          (x) => x.toLowerCase() === paramkey.toLowerCase()
        );

        if (matchedKey) {
          paramValue = record[matchedKey];
          if (paramValue) {
            newLink = newLink.replace(
              new RegExp(param, 'ig'),
              toTrim(paramValue)
            );
          }
        } else {
          newLink = newLink.replace(new RegExp(param, 'ig'), toTrim(''));
        }
      }
    }
  });

  return newLink;
}

// checking if there is no value in hyperlink param then it set key as a paramValue
function setParamKeyValue(record, allData, paramkey) {
  let paramValue: boolean = false;
  if (allData && allData.length > 0) {
    allData.forEach((data) => {
      if (data.records && data.records.length > 0) {
        data.records.forEach((allRecord: any) => {
          if (paramValue === false) {
            paramValue = Object.keys(allRecord).some(
              (record) => record.toLowerCase() === paramkey.toLowerCase()
            );
          }
        });
      }
    });
  } else {
    paramValue = Object.keys(record).some((x) => x === paramkey.toLowerCase());
  }

  return paramValue;
}

function getPropertyValue(data: any, propName: string) {
  let propValue: any;
  data.records?.forEach((record: any) => {
    for (const [key, value] of Object.entries(record)) {
      if (key && propName && key.toLowerCase() === propName.toLowerCase()) {
        propValue = value;
      }
    }
  });
  return propValue;
}

function setPropValue(obj: any, prop: IDictionary) {
  const matchedKey: string = getMatchKey(obj, prop.name);
  if (matchedKey) {
    return (obj[matchedKey] = prop.value);
  }
}

function formatFormFieldCValue(field: IFormField) {
  if (
    field.format?.type === EFormatType.BOOLEAN_YN &&
    field.format?.formatter?.name === 'toBoolean'
  ) {
    return field.value === 1 || field.value === true ? 'Y' : 'N';
  } else if (
    field.control === EFormControl.CALENDAR &&
    (field.value || field.value === '')
  ) {
    return (field.value =
      field.showTime === true
        ? toShortDateTime(field.value, field.format)
        : toShortDate(field.value, field.format));
  } else if (
    field.control === EFormControl.LOOKUP_INPUT &&
    field.value &&
    typeof field.value === 'object'
  ) {
    return field.value.value;
  } else if (
    field.label &&
    field.label.labelControl &&
    field.label.labelControl.control === EFormControl.LOOKUP_INPUT &&
    field.value &&
    typeof field.value === 'object'
  ) {
    return field.value.value;
  } else {
    return field.value;
  }
}

export function autoSetLookupData(fieldData: any, response: any) {
  let obj = {};
  let record = setDataFields([response]);
  if (record && record.length > 0) {
    record.forEach((x) => {
      record = x;
    });
  }
  if (fieldData && record) {
    Object.entries(fieldData).forEach(([dataKey, dataValue]: any) => {
      let rowKeys = Object.keys(record);
      let key = rowKeys?.find(
        (x) => x?.toLowerCase() === dataKey?.toString()?.toLowerCase()
      );
      let value = rowKeys?.find(
        (x) =>
          dataValue &&
          dataValue?.toString().includes('{') &&
          x?.toLowerCase() ===
            dataValue
              ?.toString()
              ?.toLowerCase()
              ?.replace('{', '')
              ?.replace('}', '')
      );
      if (value && value.length > 0) {
        obj = { ...obj, [dataKey]: record[value.toLowerCase()] };
      } else if (key && key.length > 0) {
        obj = { ...obj, [dataKey]: record[key.toLowerCase()] };
      } else {
        obj = { ...obj, [dataKey]: dataValue };
      }
    });
    return obj;
  } else {
    return null;
  }
}

export function setGridLookupData(
  column: IGridColumn[],
  field: string,
  data: any
) {
  let obj = column.find((x) => x.field?.toLowerCase() === field.toLowerCase());
  if (obj && obj.lookupControl?.data) {
    obj.lookupControl.data.data = data;
  }
}

export function getGridFieldValue(
  column: IGridColumn[],
  field: string,
  response: any
) {
  let value: string = '';
  let obj = column.find((x) => x.field?.toLowerCase() === field.toLowerCase());
  if (obj && response) {
    if (obj.type === EGridColumnType.LOOKUP_INPUT && obj.displayField) {
      value =
        typeof response[obj.field.toLowerCase()] === 'object'
          ? response[obj.field.toLowerCase()].text
          : response[obj.field.toLowerCase()];
    } else {
      value = response[obj.field.toLowerCase()];
    }
  }
  return value;
}

export function setDataFields(response: any[]) {
  let data: any = [];
  if (response && response.length > 0) {
    response.map((x: any, index: number) => {
      const result = Object.keys(x).reduce(
        (prev, current) => ({ ...prev, [current.toLowerCase()]: x[current] }),
        {}
      );

      data.push(result);
    });
  }
  return data;
}

export function setDialogResponse(
  formField: any,
  formData: any,
  response: any
) {
  let value: any;
  if (response) {
    // if selectedValue does not exist then consider valueField as selectedValue
    if (
      formData &&
      formData.data &&
      formData.data.valueField &&
      !formData.data.selectedValue
    ) {
      formData.data.selectedValue = formData.data.valueField;
    }

    const valueMatchKey: string = getMatchKey(
      response,
      formData?.data?.valueField
    );
    const labelMatchKey: string = getMatchKey(
      response,
      formData?.data?.selectedValue
    );

    if (
      formData?.data &&
      formData?.data.selectedValue &&
      formData?.data.valueField
    ) {
      let selectedValue = response[valueMatchKey];
      let matchText = response[labelMatchKey];
      if (typeof selectedValue === 'string' && typeof matchText === 'string') {
        selectedValue = selectedValue.trim();
        matchText = matchText.trim();
      }
      value = { text: matchText, value: selectedValue };
    } else {
      const FieldKey: string = getMatchKey(response, formField.field);
      let value = response[FieldKey];
      if (value) {
        value = value.trim();
      }
    }
  }
  return value;
}

export function currentUrl(): string {
  let currentRoute: string = '';
  let url = window.location.href;
  if (url) {
    let arr = url.split('/');
    currentRoute = arr[arr.length - 1];
  }
  return currentRoute;
}

export function getGridFilters() {
  let filters: any = [];
  let gridFilters = currentUrl();
  if (gridFilters && gridFilters.length > 0) {
    const localFilter = JSON.parse(
      localStorage.getItem('SetFilters-' + gridFilters) as any
    );
    filters = localFilter?.filters;
  }
  return filters;
}

//update the hidden or disabled and value based off other global filters.
export function setGlobalFilterPropValues(
  globalFilter: IGlobalFilter[],
  field: string,
  props: IFilterDictionary[]
) {
  return globalFilter.map((filter) => {
    if (
      (filter.field && filter.field.toLowerCase() === field?.toLowerCase()) ||
      (filter.displayText &&
        filter.displayText.toLowerCase() === field?.toLowerCase())
    ) {
      props?.map((prop: IFilterDictionary) => {
        if (filter.hasOwnProperty(prop.propName)) {
          return (filter[prop.propName] = prop.propValue);
        } else if (prop.propValue && prop.propValue.length > 0) {
          return (filter.value = prop.propValue);
        }
      });
    }
  });
}

export function setCardFieldsData(form: any, response?: any) {
  let data: any;
  if (form && form.dynamicform) {
    const { dynamicform, ...newData } = form;
    dynamicform?.formSections?.forEach((section) => {
      section.fields?.forEach((field) => {
        if (newData) {
          setEditFormFields({ records: [newData] }, dynamicform);
        }
      });
    });
  }
}

// disable Grid EditableRow Column
export function disableEditRowColumn(
  columns: IGridColumn[],
  field: string
): IGridColumn[] {
  if (field && columns && columns.length > 0) {
    let obj = columns.find(
      (x) => x.field?.toLowerCase() === field.toLowerCase()
    );
    let disableObj = { ...obj, disabled: true };
    const index = columns.findIndex(
      (i) => i.field.toLowerCase() === field.toLowerCase()
    );
    if (index !== -1) columns[index] = disableObj;
  }
  return columns;
}

// enabled Grid EditableRow Column
export function enabledEditRowColumn(
  columns: IGridColumn[],
  field: string
): IGridColumn[] {
  if (field && columns && columns.length > 0) {
    let obj = columns.find(
      (x) => x.field?.toLowerCase() === field.toLowerCase()
    );
    let enableObj = { ...obj, disabled: false };
    const index = columns.findIndex(
      (i) => i.field.toLowerCase() === field.toLowerCase()
    );
    if (index !== -1) columns[index] = enableObj;
  }
  return columns;
}
