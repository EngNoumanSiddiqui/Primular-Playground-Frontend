import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { SelectionComponent } from '../grid-selection/selection.component';
import {
  EValidator,
  EFormControl,
  IDynamicForm,
  EFormatType,
  GridFilterControlType,
  EGridColumnType,
  ESelectFileType,
} from '../../models';
import { ISelectItem, EPermissionType } from '../../models';
import { FormService } from '../../services/form.service';
import { HeaderService } from '../../services/header.service';
import { RequestService } from '../../services/request.service';
import { AlertService } from '../../services/alert.service';
import { DropdownService } from '../../services/dropdown.service';
import * as utilities from '../../services/utilities.service';
import { IFormField, IFormSection } from '../../models';
import { ESidebarAction, UserData } from 'src/app/models';
import { GridGlobalFiltersComponent } from '../grid-global-filters/grid-global-filters.component';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { GridlookupComponent } from '../grid-lookup/grid-lookup.component';
import { ISidebar } from '../../models';
import { EHyperlink } from '../../models';
import { GridSelectionComponent } from '../grid-selection/grid-selection.component';
import { EHeaderFormatType, IHeader } from '../../models';
import { GridclientsidepaginationComponent } from '../grid-clientside-pagination/grid-clientside-pagination.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  timeShow: string = '';
  public users: UserData[] = [];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];
  public streetNumbers: any[] = [];
  imageSource: any;

  leftSidebarItems: ISidebar[] = [
    {
      // permissions: [{ type: EPermissionType.VIEW, roles: ['SalesRepManager'] }],
      icon: 'pi pi-user-edit',
      section: 'Edit Section 1',
      component: GridGlobalFiltersComponent,
      action: ESidebarAction.OPENDIALOG,
      hidden: false,
      disabled: false,
      data: {
        header: 'Edit From',
        width: '70%',
        data: { value: 'Hello World' },
      },
      onReturn: (data: any) => {
        console.log('data received from modal component:', data);
      },
      onClick: (item: any) => {
        console.log('side bar item clicked:', item);
      },
    },
    {
      icon: 'pi pi-user-plus',
      section: 'Edit Section 2',
      component: GridGlobalFiltersComponent,
      action: ESidebarAction.OPENDIALOG,
      disabled: false,
      hidden: false,
      data: {
        header: 'Edit From',
        width: '70%',
        data: { value: 'Hello World' },
      },
      onReturn: (data: any) => {
        console.log('data received from modal component:', data);
      },
    },
    {
      icon: 'pi pi-calendar',
      section: 'Edit Section 3',
      component: GridViewComponent,
      action: ESidebarAction.OPENDIALOG,
      //disabled: true,
    },
    {
      icon: 'pi pi-users',
      section: 'Edit Section 4',
      component: GridGlobalFiltersComponent,
      action: ESidebarAction.OPENDIALOG,
      onClick: (item) => {
        console.log('pi-copy', item);
      },
    },
    {
      icon: 'pi pi-copy',
      section: 'Edit Section 5',
      component: GridlookupComponent,
      action: ESidebarAction.OPENDIALOG,
      onClick: (item) => {
        console.log('pi-copy', item);
      },
    },
    {
      icon: 'pi pi-clock',
      section: 'Edit Section 6',
      component: GridViewComponent,
      action: ESidebarAction.OPENDIALOG,
      //hidden: true
    },
  ];

  isFromModal: boolean = false;
  id: any = '';
  data: string[] = [];
  taxURL: string = '';
  dynamicForm: IDynamicForm;
  suitId: string = '';

  status: ISelectItem[] = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '2' },
    { label: 'Busy', value: '3' },
    { label: 'Offline', value: '4' },
  ];

  /* For Header */
  headers: IHeader = {
    // permissions: [
    //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
    //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
    // ],
    fields: [
      // {
      //   label: 'ID#',
      //   control: EFormControl.LABEL,
      //   value: '650993',
      //   column: 3,
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.headerService.addLabel({ label: 'ID#', value: '650993', column: 3 }),
      // {
      //   label: 'Initiated',
      //   control: EFormControl.LABEL,
      //   value: '06/28/2021 - 10:19 am',
      //   column: 3,
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.headerService.addLabel({
        label: 'Initiated',
        value: '50',
        column: 3,
      }),
      // this.headerService.addLabel({
      //   label: 'Currency',
      //   value: '80',
      //   format: {
      //     type: EFormatType.CURRENCY,
      //     formatParams: {
      //       currency: 'EUR',
      //     },
      //   },
      // }),
      this.headerService.addLabel({
        label: 'Percent',
        value: '25',
        format: {
          type: EFormatType.PERCENT,
          formatParams: {},
        },
      }),
      this.headerService.addLabel({
        label: 'Decimal',
        value: '654',

        format: {
          type: EFormatType.DECIMAL,
          formatParams: {
            digitsInfo: '4',
          },
        },
      }),
      // {
      //   label: 'Status',
      //   value: null,
      //   control: EFormControl.DROPDOWN,
      //   data: this.status,
      //   column: 3,
      //   permissions: [
      //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   ],
      // },
      this.headerService.addLabel({
        label: 'showTime',
        value: '2022-04-12T00:00:00',
        column: 3,
        // showTime: true,
        //  timeOnly: true,
      }),

      this.headerService.addDropdown({
        label: 'Status',
        value: null,
        column: 3,
        data: this.status,
      }),
      // {
      //   label: 'Est. Commission',
      //   value: '$0',
      //   control: EFormControl.LABEL,
      //   column: 3,
      //   // permissions: [
      //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      //   // ],
      // },
      this.headerService.addLabel({
        label: 'Est. Commission',
        value: '$0',
        column: 3,
      }),

      // {
      //   label: 'Test Button',
      //   value: 'Submit',
      //   control: EFormControl.BUTTON,
      //   class: EButtonClass.SUCCESS,
      //   column: 3,
      //   onClick: function () {
      //     console.log('button click event invoked');
      //   },
      // },
      this.headerService.addCheckbox({ label: 'Active' }),

      // this.headerService.addHyperlink({
      //   label: 'Google',
      //   hyperlink: {
      //     target: EHyperlink.BLANK,
      //     link: 'http://www.google.com',
      //   },
      //   column: 3,
      // }),

      this.headerService.addCalendar({
        label: 'Created Date',
        showTime: true,
        value: this.timeShow,
        // format: { type: EHeaderFormatType.MEDIUMDATE },
        column: 9,
      }),

      // this.headerService.addButton({
      //   label: 'Test Button',
      //   value: 'Submit',
      //   column: 3,
      //   class: EButtonClass.SUCCESS,
      //   data: this.sumOnClick,
      // }),
    ],
  };

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private dropdownService: DropdownService,
    private formService: FormService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public router: Router,
    public dialogService: DialogService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.getAllFiles();
    /*For Left-Sidebar */

    // in case of getting id for edit from "modal popup config"
    if (this.id && this.id.length > 0) {
      this.loadDataForEdit();
    } else {
      // in case of getting id for edit from "query param"
      this.route.queryParams.subscribe((params: Params) => {
        if (params.id) {
          this.id = params.id;
        }
      });
    }

    // in case of displaying form in modal popup
    if (this.config) {
      this.isFromModal = true;
      if (this.config.data && this.config.data.id) {
        this.id = this.config.data.id.toString();
      }
    }

    this.initilizeForm().then((res: any) => {
      console.log('dynamicFormdynamicForm: ', this.dynamicForm);
      this.users = [];
      if (this.id && this.id.length > 0) {
        this.loadDataForEdit();
        //   utilities.setAddComponentData(this.dynamicForm,'55', {setValue:'Hello World'});
        // console.log("form22:",this.dynamicForm)
      }
    });
  }

  async initilizeForm() {
    let __this = this;
    let googleHyperLink = await this.formService.addHyperlink({
      label: 'Google',
      disabled: false,
      hidden: false,
      hyperlink: {
        //component: SelectionComponent,
        target: EHyperlink.IFRAME,
        link: '{{lastname}}{{age}}{{serialnumber}}',
        // id: '123',
        //linkId: 'ddd',
        // linkId: 'suithold',
        width: '100%',
        height: '90%',
        // params: { aGe: '', last4555name: '', SerialNumBER: '', SuitId: '888' },
      },
      onClick: () => {
        console.log('on click invoked');
      },
      onReturn: function (res) {
        console.log('onReturn', res);
      },
    });

    let googleHyperLink1 = await this.formService.addHyperlink({
      label: 'Hyperlink Component',
      disabled: false,
      hyperlink: {
        component: SelectionComponent,
        target: EHyperlink.DIALOG,
        width: '100%',
        height: '90%',
        params: { age: '1122', firstname: '', serialnumber: '', SuitId: '888' },
      },
      onClick: () => {
        console.log('on click invoked');
      },
      onReturn: function (res) {
        console.log('onReturn', res);
      },
    });

    let streetNum1 = await this.formService.addDropdown(
      {
        field: 'StreetNumber',
        label: 'Street Number 1',
        allowSearch: true,
        optionLabel: 'value',
        optionValue: 'label',
        // validations: [{ type: EValidator.REQUIRED }],
        onFocusOut: function (formField: IFormField) {
          const value = formField.value;
          if (value) {
            let street2Field: any = utilities.getFormField(
              __this.dynamicForm,
              'StreetNumber2'
            );
            street2Field = __this.formService.getDropdownData(
              street2Field,
              'Customer-GetStreetNumbers-StoredProcedure',
              'ID',
              'StREEtNUmber',
              [utilities.setAndFilter('CID', value)]
            );
            utilities.setFormField(__this.dynamicForm, street2Field);
          }
        },
      },
      {
        uniqueKey: 'Customer-GetStreetNumbers-StoredProcedure',
        valueProp: 'ID',
        labelProp: 'StREEtNUmber',
        // filters: [
        //   // utilities.setAndFilter('ID', this.id)
        // ],
      }
    );

    let streetNum2 = await this.formService.addDropdown({
      field: 'StreetNumber2',
      label: 'Street Number 2',
      optionLabel: 'value',
      optionValue: 'label',
      //  validations: [{ type: EValidator.REQUIRED }],
    });

    this.dynamicForm = {
      // permissions: [
      //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
      //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
      // ],
      formSections: [
        {
          name: 'Lead Information',
          icon: 'pi pi-fw pi-user-plus',
          accordionDisabled: false,
          showAccordion: true,
          //  hidden: false,
          // permissions: [
          //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
          //   { type: EPermissionType.EDIT, roles: ['SalesRepManager1'] },
          // ],
          links: [
            {
              name: 'Add Referal',
              onClick: () => {
                console.log('Hello Referal.');
              },
            },
          ],
          fields: [
            this.formService.addSwitch({
              label: 'Selection',
              hidden: false,
              disabled: false,
              onClick: () => {
                console.log('on click invoked', this.dynamicForm);
              },
            }),
            {
              label: 'Age',
              field: 'AGE',
              control: EFormControl.NUMERIC,
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
              // ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
                // if (formField.value?.length < 3) {
                //   alert('last name should be min of 3 chracters.');
                // }
              },
            },
            this.formService.addButton({
              icon: 'pi pi-check',
              label: 'OnClick Button',
              color: 'blue',
              hidden: false,
              onClick: () => {
                console.log('on click invoked', this.dynamicForm);
              },
            }),
            // this.formService.addTextbox({
            //   field: 'Phone',
            //   //label: 'Phone',
            //   label: {
            //     name: 'Phone',
            //     labelControl: await this.formService.addHyperlink({
            //       hyperlink: {
            //         target: EHyperlink.BLANK,
            //         link: 'http://www.google.com',
            //         linkId: 'suithold',
            //         params: {
            //           LASTNAME: '',
            //           Age: '333',
            //           SerialNumber: '333',
            //           suitId: '555',
            //         },
            //       },
            //     }),
            //   },
            //   onClick: () => {
            //     console.log('on click invoked');
            //   },
            //   onReturn: function (res) {
            //     console.log('onReturn', res);
            //   },
            //   lookupControl: {
            //     component: SelectionComponent,
            //     data: {
            //       header: 'Grid selection',
            //       width: '80%',
            //       matchField: 'firstname',
            //       data: { codeType: 'Bedroom' },
            //     },
            //   },
            //   // permissions: [
            //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
            //   // ],
            //   validations: [
            //     { type: EValidator.PHONE, expression: '' },
            //     { type: EValidator.REQUIRED },
            //   ],
            //   onFocusOut: function (formField: IFormField) {
            //     console.log('onFocusOut:', formField);
            //   },
            // }),
            {
              label: 'MultiSelect',
              field: 'MULTISELECT',
              control: EFormControl.DISPLAY_FILE,
              //  validations: [{ type: EValidator.REQUIRED }],
              data: this.imageSource,
              column: 12,
            },
            // {
            //   label: 'Created Date',
            //   field: 'CreatedDate',
            //   control: EFormControl.CALENDAR,
            //   showTime: true,
            //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
            //   permissions: [
            //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
            //   ],
            // },
            this.formService.addCalendar({
              field: 'createddate',
              label: 'Created Date',
              validations: [{ type: EValidator.REQUIRED }],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
              monthOnly: true,
              // timeOnly: true,
              //showTime: true,
              format: { type: EFormatType.LONGDATE },
            }),
            {
              label: 'Active',
              field: 'Active',
              control: EFormControl.CHECKBOX,
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
              // ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
              format: { type: EFormatType.BOOLEAN_YN },
            },
            //this.formService.addCheckbox({ field: 'Active', label: 'Active' }),
            // {
            //   label: 'Email',
            //   field: 'email',
            //   control: EFormControl.INPUT,
            //   validations: [
            //     { type: EValidator.REQUIRED, expression: '' },
            //     {
            //       type: EValidator.EMAIL,
            //     },
            //   ],
            //   // permissions: [
            //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
            //   // ],
            //   onFocusOut: function (formField: IFormField) {
            //     console.log('onFocusOut:', formField);
            //   },
            // },
            // this.formService.addTextbox({
            //   field: 'Email',
            //   label: 'Email',
            //   validations: [
            //     { type: EValidator.REQUIRED, expression: '' },
            //     { type: EValidator.EMAIL },
            //   ],
            //   // permissions: [
            //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
            //   // ],
            //   onFocusOut: function (formField: IFormField) {
            //     console.log('onFocusOut:', formField);
            //   },
            // }),

            this.formService.addTextbox({
              field: 'Email',
              column: 1,
              label: {
                name: 'CC Email',
                labelControl: await this.formService.addHyperlink({
                  hyperlink: {
                    target: EHyperlink.BLANK,
                    linkId: 'ccc',
                    params: {
                      ID: 'this.accountId',
                      IDNAME: 'accountid',
                      EMAIL: '',
                    },
                  },
                }),
              },
              validations: [{ type: EValidator.EMAIL, expression: '' }],
              tables: ['ACCOUNT'],
              onFocusOut: function (formField: IFormField) {
                // __this.setVisibility();
              },
            }),
            {
              label: 'Modified Date',
              field: 'ModifiedDate',
              control: EFormControl.CALENDAR,
              showTime: true,
              timeOnly: true,
              validations: [{ type: EValidator.REQUIRED, expression: '' }],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
              // ],
            },
            // this.formService.addCalendar({
            //   field: 'ModifiedDate',
            //   label: 'Modified Date',
            //   validations: [{ type: EValidator.REQUIRED }],
            //   showTime: true,
            //   permissions: [
            //     { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //     { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
            //   ],
            // }),
            {
              label: 'Serial Number',
              field: 'SerialNumber',
              control: EFormControl.NUMERIC,
              validations: [{ type: EValidator.REQUIRED, expression: '' }],
            },
            // this.formService.addNumericTextbox({
            //   field: 'age',
            //   label: {
            //     name: 'Net Profit',
            //     labelControl: this.formService.addDialog({
            //       lookupControl: {
            //         id: '88',
            //         component: SelectionComponent,
            //         data: {
            //           header: 'Net Profit Breakdown',
            //           data: { AgE: '', firstname: '159' },
            //         },
            //       },
            //     }),
            //   },
            //   disabled: true,
            // }),
            this.formService.addNumericTextbox({
              label: 'Currency',
              field: 'SerialNumber',
              format: {
                type: EFormatType.CURRENCY,
                formatParams: {
                  digitsInfo: '2',
                  currency: 'EUR',
                  locale: 'de-DE',
                },
              },
            }),
            this.formService.addNumericTextbox({
              label: 'Decimal',
              field: 'SerialNumber',
              format: {
                type: EFormatType.DECIMAL,
                formatParams: { digitsInfo: '4' },
              },
            }),
            this.formService.addNumericTextbox({
              label: 'Percent',
              field: 'SerialNumber',
              format: { type: EFormatType.PERCENT },
            }),
            // {
            //   label: 'File Upload',
            //   field: 'CFirstName',
            //   column: 6,
            //   control: EFormControl.FILE_UPLOAD,
            //   onReturn: function (response: any) {
            //     console.log('onReturn', response);
            //   },
            // },
            this.formService.addFileUpload({
              label: 'File Upload',
              field: 'Age',
              column: 6,
              control: EFormControl.FILE_UPLOAD,
              //validations: [{ type: EValidator.REQUIRED, expression: '' }],
              onReturn: function (response: any) {
                console.log(
                  'onReturn',
                  response,
                  '__this.imageSource:',
                  __this.imageSource
                );
                if (response) {
                  const arr = [...__this.imageSource, ...response];
                  // arr.concat(response);
                  console.log('onReturn imageSource', __this.imageSource);
                  __this.dynamicForm.formSections.forEach((x) => {
                    x.fields.forEach((field) => {
                      if (field.control === EFormControl.DISPLAY_FILE) {
                        field.data = arr;
                      }
                    });
                  });
                  setTimeout(() => {
                    __this.imageSource = [...arr];

                    __this.dynamicForm = { ...__this.dynamicForm };
                    console.log('onReturn dynamicForm', __this.dynamicForm);
                  }, 5000);
                }
              },
              selectMultipleFiles: true,
              SetfileTypes: ESelectFileType.IMAGE,
            }),
            this.formService.addAutoComplete({
              field: 'StreetNumber',
              label: 'Auto Complete',
              displayField: 'Id',
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
              onReturn: function (search: any, formField: IFormField) {
                if (search && formField) {
                  __this.formService.getAutoCompleteData(
                    formField,
                    'Customer-GetStreetNumbers-StoredProcedure',
                    [utilities.setAndFilter('ID', this.id)]
                  );
                }
              },
            }),
            // this.formService.addNumericTextbox({
            //   field: 'SerialNumber',
            //   label: 'Serial Number',
            //   validations: [{ type: EValidator.REQUIRED }],
            // }),
            {
              label: 'Has Orders',
              field: 'HasOrders',
              control: EFormControl.CHECKBOX,
              // validations: [],
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
              // ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
            },

            // this.formService.addCheckbox({
            //   field: 'HasOrders',
            //   label: {
            //     name: 'Has Orders',
            //     labelControl: await this.formService.addHyperlink({
            //       hyperlink: {
            //         target: EHyperlink.BLANK,
            //         linkId: 'Has Orders',
            //         params: { AccountId: '' },
            //       },
            //     }),
            //   },
            //   tables: ['123'],
            //   format: {
            //     type: EFormatType.BOOLEAN_YN,
            //     formatter: utilities.toBoolean,
            //   },
            // }),

            this.formService.addSpaceField({
              column: 3,
            }),

            streetNum1,
            streetNum2,

            // this.formService.addDropdown({
            //   field: 'StreetNumber',
            //   label: 'Street Number',
            //   validations: [{ type: EValidator.REQUIRED }],
            //   data: this.streetNumbers,
            // }),
            {
              label: 'Tax',
              field: '',
              //control: EFormControl.HYPERLINK,
              hyperlink: {
                target: EHyperlink.PARENT,
                link: 'http://www.google.com',
                linkId: 'suithold',
                params: { LastName: '' },
              },
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
              // ],
            },
            {
              label: 'Total Orders',
              field: 'TotalOrders',
              control: EFormControl.NUMERIC,
              validations: [{ type: EValidator.REQUIRED, expression: '' }],
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
              // ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
              },
            },
            // this.formService.addNumericTextbox({
            //   field: 'TotalOrders',
            //   label: 'Total Orders',
            //   validations: [{ type: EValidator.REQUIRED }],
            // }),
            {
              label: 'Building Notes',
              field: 'notes',
              control: EFormControl.NOTE_FIELD,
              onReturn: function (note) {
                this.value = note;
              },
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
              // ],
            },
            // this.formService.addNoteField({
            //   field: 'Notes',
            //   label: 'Building Notes',
            //   onReturn: function (note) {
            //     this.value = note;
            //   },
            // }),
            // this.formService.addHyperlink({
            //   label: 'Google',
            //   hyperlink: {
            //     target: EHyperlink.BLANK,
            //     linkId: 'suithold',
            //     params: { suitid: '678' },
            //   },
            // }),
            googleHyperLink,
            googleHyperLink1,
          ],
        },
        {
          // permissions: [
          //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
          //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
          // ],
          name: 'Accounts',
          icon: 'pi pi-fw pi-user',
          links: [
            {
              name: 'Add Account',
              onClick: () => {
                console.log('Hello Account.');
              },
            },
            {
              name: 'Add Contact',
              onClick: () => {
                console.log('Hello Contact.');
              },
            },
          ],
          fields: [
            // {
            //   label: 'Lookup Control',
            //   field: 'LookupControl', // field that will be used for row selection
            //   value: 'Test13', // value that will be set as selected in row selection
            //   control: EFormControl.LOOKUP_INPUT,
            //   lookupControl: {
            //     component: SelectionComponent,
            //     data: {
            //       header: 'Grid selection',
            //       width: '80%',
            //       matchField: 'firstname',
            //       data: { codeType: 'Bedroom' },
            //     },
            //   },
            //   // permissions: [
            //   //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //   //   { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
            //   // ],
            // },

            this.formService.addLookUp({
              field: 'companyname',
              displayField: 'CompanynName',
              label: 'Company',
              tables: ['LFOPPORT'],

              lookupControl: {
                component: SelectionComponent,
                data: {
                  header: 'Company Selection',
                  width: '100%',
                  selectedValue: 'cfirstname',
                  valueField: 'cfirstname',

                  data: { cfirstname: '' },
                },
              },
              onFocusOut: function (formField: IFormField) {},
              onReturn(res, row) {
                console.log('row: ', row);
                console.log('res: ', res);
              },
            }),

            this.formService.addLookUp({
              field: 'firstname',
              label: 'First Name',
              displayField: 'lastname',
              // disabled: false,
              // label: {
              //   name: 'First Name',
              //   labelControl: await this.formService.addDialog({
              //     lookupControl: {
              //       component: SelectionComponent,
              //       data: {
              //         header: 'Grid selection',
              //         width: '80%',
              //         data: { firstname456: '456', firstname: 'Hello world' },
              //       },
              //     },
              //   }),
              //   onReturn: function (res) {
              //     console.log('label onReturn', res);
              //   },
              // },
              // onClick: () => {
              //   console.log('on click invoked');
              // },
              // onReturn: function (res, row) {
              //   console.log('onReturn', res, 'RowData', row);
              // },
              // value: 'Test13', // value that will be set as selected in row selection
              lookupControl: {
                component: SelectionComponent,
                data: {
                  header: 'Grid selection',
                  width: '80%',
                  valueField: 'cfirstname', // field that will be used for row selection
                  selectedValue: 'LAstNAme',
                  data: {
                    randomValue: 'randomValue',
                    lastname: '',
                    totalorders: '',
                  },
                },
              },
              // validations: [
              //   { type: EValidator.REQUIRED, expression: '' },
              //   { type: EValidator.MINLENGTH, expression: 6 },
              //   { type: EValidator.MAXLENGTH, expression: 15 },
              // ],
              // permissions: [
              //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
              //   { type: EPermissionType.EDIT, roles: ['SalesRepManager1'] },
              // ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
                console.log('onFocusOut-2:', formField.value);
              },
            }),
            this.formService.addCheckbox({
              field: 'lastname',
              label: 'Last Name',
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
                const perdiemValue: string = utilities.getFormFieldValue(
                  __this.dynamicForm,
                  'lastname'
                );
                utilities.setAddComponentData(__this.dynamicForm, '55', {
                  value: utilities.getFormFieldValue(
                    __this.dynamicForm,
                    'lastname'
                  ),
                });
              },
            }),
            this.formService.addComponent({
              componentControl: {
                component: GridclientsidepaginationComponent,
                id: '55',
                //setValue:'hello',
                data: { age: '123', lastname: '', ali: '123' },
              },
              column: 12,
            }),
            // this.formService.addTextbox({
            //   field: 'lastname',
            //   label: {
            //     name: 'Last Name',
            //     labelControl: await this.formService.addDialog({
            //       lookupControl: {
            //         component: SelectionComponent,
            //         data: {
            //           header: 'Grid selection',
            //           width: '80%',
            //           matchField: 'firstname',
            //           matchValue: 'lastname',
            //           data: { codeType: 'Bedroom' },
            //         },
            //       },
            //     }),
            //     onReturn: function (res) {
            //       console.log('label onReturn', res);
            //     },
            //   },
            //   onFocusOut: function (formField: IFormField) {
            //     console.log('onFocusOut:', formField);
            //   },
            //   validations: [
            //     { type: EValidator.REQUIRED, expression: '' },
            //     { type: EValidator.MINLENGTH, expression: 6 },
            //     { type: EValidator.MAXLENGTH, expression: 15 },
            //   ],
            // }),
            // {
            //   label: 'Last Name',
            //   field: 'LASTNAME',
            //   control: EFormControl.INPUT,
            //   value: '',
            //   validations: [
            //     { type: EValidator.REQUIRED, expression: '' },
            //     { type: EValidator.MINLENGTH, expression: 6 },
            //     { type: EValidator.MAXLENGTH, expression: 15 },
            //   ],
            // permissions: [
            //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            //   { type: EPermissionType.EDIT, roles: ['SalesRepManager'] },
            // ],
            //   onFocusOut: function (formField: IFormField) {
            //     if (formField.value?.length < 3) {
            //       __this.hiddenValue();
            //     }
            //   },
            // }
          ],
        },
      ],
    };
  }

  hiddenValue() {
    utilities.setFormPropValues(this.dynamicForm, 'firstname', [
      { name: 'hidden', value: true },
    ]);
  }
  // loadStreetNumbers(search: any, field: any) {
  //   this.dropdownService
  //     .setDropDownList(
  //       'Customer-GetStreetNumbers-StoredProcedure',
  //       'Id',
  //       'StreetNumber'
  //     )
  //     .then((res: any) => {
  //       field.data.push(...res);
  //     })
  //     .catch((error) => {
  //       this.alertService.apiError(error);
  //     });
  // }

  sumOnClick() {
    console.log('Click event working *** ');
  }

  valOnReturn(val: any) {
    return val;
  }

  getAllFiles() {
    this.requestService
      .get('/Data/Fetch', { uniqueKey: 'GetAllFromAzureUpload' })
      .subscribe((data) => {
        console.log('response:', data.records);
        this.imageSource = data.records;
      });
  }

  loadDataForEdit() {
    //utilities.setAddComponentData(this.dynamicForm,'55', {setValue:'Hello World'});
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
        filters: [
          // {
          //   field: 'ID',
          //   matchMode: 'equals',
          //   operator: 'and',
          //   value: this.id,
          // },
          utilities.setAndFilter('ID', this.id),
        ],
      })
      .subscribe(
        (data) => {
          console.log('data', data);
          // utilities.setAddComponentData(this.dynamicForm, '55', {
          //   value: 'loadDataForEdit value received...',
          // });

          // this.dynamicForm = {...this.dynamicForm};

          utilities.setHyperlinkComponentData(
            this.dynamicForm,
            'Hyperlink Component',
            {
              lastName: '22',
              age: '33',
            }
          );

          // utilities.setAddComponentData(this.dynamicForm,'55', {setValue:'Hello World111'});
          // console.log("form22:",this.dynamicForm)

          // if (data.records && data.records.length > 0) {
          //   for (const [key, value] of Object.entries(data.records[0])) {
          //     this.dynamicForm.formSections.forEach((formSection) => {
          //       if (formSection.fields) {
          //         formSection.fields.forEach((item) => {
          //           if (item.field === key) {
          //             if (item.control === EFormControl.CALENDAR) {
          //               item.value = new Date(value as string);
          //             } else {
          //               item.value = value;
          //             }
          //           }
          //         });
          //       }
          //     });
          //   }
          //}

          if (data) {
            console.log('DynamicForm Data:', data);
            this.taxURL =
              data.records[0] && data.records[0].Age
                ? `http://mriweb/mripage.asp?PAGE=TAXINFO&GROUP=W000001&MENUNAME=W000001&AGE=${data.records[0].Age}`
                : '';

            // utilities.setFormField(this.dynamicForm, {
            //   label: 'Tax',
            //   control: EFormControl.HYPERLINK,
            //   hyperlink: { target: EHyperlink.BLANK, link: this.taxURL },
            // });
          }
          let ccemail = utilities.getFormFieldValue(this.dynamicForm, 'Email');
          // set any link param value
          utilities.setLinkParamValues(this.dynamicForm, 'Email', [
            { name: 'EMAIL', value: 'Abdul' },
          ]);

          // set lookup data
          // utilities.setLookupData(this.dynamicForm, 'firstname', {
          //   lastName: '', age: '', totalorders: '',
          // });

          // set form fields values using api response
          utilities.setEditFormFields(data, this.dynamicForm);
          console.log('form:', this.dynamicForm);

          this.timeShow = utilities.getFormFieldValue(
            this.dynamicForm,
            'ModifiedDate'
          );
          //console.log("XXXXX",this.timeShow.getDay());

          // get firstName value from form lookup field
          let firstName = utilities.getFormFieldValue(
            this.dynamicForm,
            'firstname'
          );
          console.log('firstName value from lookup', firstName);

          let displayValue = 'Display';

          utilities.setFormFieldValue(
            this.dynamicForm,
            'lastname',
            '1111',
            'abc'
          );

          // set any form param value
          utilities.setFormPropValues(this.dynamicForm, 'Google', [
            { name: 'hidden', value: true },
          ]);

          utilities.setFormPropValues(this.dynamicForm, 'LastName', [
            { name: 'hidden', value: true },
          ]);

          console.log(
            'Ortiginal Last Name Value:',
            utilities.getOrigDataFieldValue(data, 'LASTNAME')
          );

          utilities.setSidebarPropValues(
            (this.leftSidebarItems = [...this.leftSidebarItems]),
            'Edit Section 1',
            [{ name: 'hidden', value: true }]
          );
          // this.leftSidebarItems = [...this.leftSidebarItems];
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  saveForm(formSections: any) {
    console.log('saveForm:', formSections);
    let uniqueKey: string = 'Customer-Query-Upsert';
    // prepare values dictionary object
    // const values = {};
    // formSections.forEach((formSection) => {
    //   if (formSection.fields) {
    //     formSection.fields.forEach((field) => {
    //       values[field.field] = field.value;
    //     });
    //   }
    // });
    const formValues = utilities.setSaveFormValues(formSections);
    // in case of update
    console.log('received:', formValues);
    if (this.id && this.id.length > 0) {
      formValues['Id'] = this.id;
    }
    let fileIds: number[] = [];
    if (formSections.fileIds && formSections.fileIds.length > 0) {
      fileIds = formSections.fileIds;
    } else {
      fileIds = this.imageSource.map((x) => x.Id);
    }

    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: uniqueKey,
        AzureUploadIds: fileIds,
        values: formValues,
        filters: [
          {
            field: 'Id',
            matchMode: 'equals',
            operator: 'and',
            value: this.id,
          },
        ],
      })
      .subscribe(
        (data) => {
          if (data) {
            this.alertService.success('Data Saved Successfully.');
          }
          this.redirectToPage(true);
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  cancelForm(fields: IFormField[]) {
    console.log('invoked cancel form event');
    this.redirectToPage();
  }

  redirectToPage(isSave: boolean = false) {
    if (this.isFromModal) {
      this.ref.close(isSave);
    } else {
      this.router.navigate(['grid-actions']);
    }
  }
}
