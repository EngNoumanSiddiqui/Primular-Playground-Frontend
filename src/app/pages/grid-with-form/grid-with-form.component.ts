import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  EFormControl,
  IFormField,
  EValidator,
  IDynamicForm,
  EGridColumnType,
  GridFilterControlType,
  IGridColumn,
  ISelectItem,
  IFormSection,
} from '@churchillliving/se-ui-toolkit';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectionComponent } from '../grid-selection/selection.component';
import { UserData } from '../../models/user.model';
import { GridGlobalFiltersComponent } from '../grid-global-filters/grid-global-filters.component';

import {
  RequestService,
  AlertService,
  DropdownService,
} from '@churchillliving/se-ui-toolkit';

import { FormService } from '@churchillliving/se-ui-toolkit';
import { GridpaginationComponent } from '../grid-pagination/grid-pagination.component';
import { GridclientsidepaginationComponent } from '../grid-clientside-pagination/grid-clientside-pagination.component';

@Component({
  selector: 'app-grid-with-form',
  templateUrl: './grid-with-form.component.html',
  styleUrls: ['./grid-with-form.component.scss'],
})
export class GridWithFormComponent implements OnInit {
  public users: UserData[] = [];
  public totalRecords: number;
  public multiSelectData: ISelectItem[] = [];
  public dropdownData: ISelectItem[] = [];

  streetNumbers: ISelectItem[] = [];
  isFromModal: boolean = false;
  id: any = '';
  data: string[] = [];

  public columns: IGridColumn[] = [
    {
      field: 'CId',
      header: 'Id',
      filtering: false,
      sorting: false,
    },
    {
      field: 'CFirstName',
      header: 'FirstName',
      filtering: false,
      sorting: false,
    },
    {
      field: 'LastName',
      header: 'Last Name',
      filtering: false,
      sorting: false,
    },
    {
      field: 'Age',
      header: 'Age',
      filtering: false,
      sorting: false,
    },
  ];

  dynamicForm: IDynamicForm = {
    column: 2,
    formSections: [
      {
        name: 'Lead Information 01',
        icon: 'pi pi-fw pi-user-plus',
        accordionDisabled: false,
        showAccordion: true,
        fields: [
          // {
          //   label: 'First Name',
          //   field: 'CFirstName',
          //   control: EFormControl.INPUT,
          //   value: '',
          //   column: 8,
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     { type: EValidator.MINLENGTH, expression: 6 },
          //     { type: EValidator.MAXLENGTH, expression: 15 },
          //   ],
          // },
          // {
          //   label: 'Last Name',
          //   field: 'LastName',
          //   value: '',
          //   column: 4,
          //   control: EFormControl.INPUT,
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     { type: EValidator.MINLENGTH, expression: 6 },
          //     { type: EValidator.MAXLENGTH, expression: 15 },
          //   ],
          // },
          // {
          //   label: 'Age',
          //   field: 'Age',
          //   value: '',
          //   control: EFormControl.NUMERIC,
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     { type: EValidator.MINIMUM, expression: 18 },
          //     { type: EValidator.MAXIMUM, expression: 25 },
          //   ],
          // },
          // {
          //   label: 'Created Date',
          //   field: 'CreatedDate',
          //   value: '',
          //   control: EFormControl.CALENDAR,
          //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
          // },
          // {
          //   label: 'Active',
          //   field: 'Active',
          //   value: null,
          //   control: EFormControl.CHECKBOX,
          //   validations: [],
          // },
          // {
          //   label: 'Email',
          //   field: 'Email',
          //   value: '',
          //   control: EFormControl.INPUT,
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     {
          //       type: EValidator.EMAIL,
          //     },
          //   ],
          // },
          // {
          //   label: 'Modified Date',
          //   field: 'ModifiedDate',
          //   value: '',
          //   control: EFormControl.CALENDAR,
          //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
          // },
          // {
          //   label: 'Serial Number',
          //   field: 'SerialNumber',
          //   value: '',
          //   control: EFormControl.NUMERIC,
          //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
          // },
          // {
          //   label: 'Has Orders',
          //   field: 'HasOrders',
          //   value: null,
          //   control: EFormControl.CHECKBOX,
          //   validations: [],
          // },
          // {
          //   label: 'Street Number',
          //   field: 'StreetNumber',
          //   value: null,
          //   control: EFormControl.DROPDOWN,
          //   data: this.streetNumbers,
          //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
          // },
          // {
          //   label: 'Total Orders',
          //   field: 'TotalOrders',
          //   value: '',
          //   control: EFormControl.NUMERIC,
          //   validations: [{ type: EValidator.REQUIRED, expression: '' }],
          // },
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
          //       matchField: 'FirstName',
          //       data: { codeType: 'Bedroom' },
          //     },
          //   },
          // },
          // {
          //   label: 'Building Notes',
          //   field: 'Notes',
          //   value: '',
          //   column: 4,
          //   control: EFormControl.NOTE_FIELD,
          //   onReturn: function (note) {
          //     this.value = note;
          //   },
          // },
          // {
          //   label: '',
          //   field: '',
          //   value: '',
          //   column: 12,
          //   control: EFormControl.COMPONENT,
          //   componentControl: {
          //     component: GridGlobalFiltersComponent,
          //     data: {
          //       hasExternalCols: true,
          //       lookUpColumns: [
          //         {
          //           field: 'CId',
          //           header: 'Id',
          //           filter: { type: GridFilterControlType.INPUT },
          //         },
          //         {
          //           field: 'CFirstName',
          //           header: 'FirstName',
          //           filter: {
          //             type: GridFilterControlType.DROPDOWN,
          //             data: this.dropdownData,
          //           },
          //         },
          //         {
          //           field: 'LastName',
          //           header: 'LastName',
          //           filter: { type: GridFilterControlType.INPUT },
          //         },
          //         {
          //           field: 'Age',
          //           header: 'Age',
          //           type: EGridColumnType.NUMERIC,
          //           filter: {
          //             type: GridFilterControlType.MULTISELECT,
          //             data: this.multiSelectData,
          //           },
          //         },
          //       ],
          //     },
          //     handlers: {
          //       onServerSideChange: (response) => {
          //         console.log('respense listener in parent component:', {
          //           response,
          //         });
          //       },
          //     },
          //   },
          // },
          this.formService.addComponent({
            componentControl: {
              component: GridGlobalFiltersComponent,
              data: {
                hasExternalCols: true,
                lookUpColumns: [
                  {
                    field: 'CId',
                    header: 'Id',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'CFirstName',
                    header: 'FirstName',
                    filter: {
                      type: GridFilterControlType.DROPDOWN,
                      data: this.dropdownData,
                    },
                  },
                  {
                    field: 'LastName',
                    header: 'LastName',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'Age',
                    header: 'Age',
                    type: EGridColumnType.NUMERIC,
                    filter: {
                      type: GridFilterControlType.MULTISELECT,
                      data: this.multiSelectData,
                    },
                  },
                ],
              },
            },
            column: 12,
          }),
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: {
                hasExternalCols: true,
                lookUpColumns: [
                  {
                    field: 'CId',
                    header: 'Id',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'CFirstName',
                    header: 'FirstName',
                    filter: {
                      type: GridFilterControlType.DROPDOWN,
                      data: this.dropdownData,
                    },
                  },
                  {
                    field: 'LastName',
                    header: 'LastName',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'Age',
                    header: 'Age',
                    type: EGridColumnType.NUMERIC,
                    filter: {
                      type: GridFilterControlType.MULTISELECT,
                      data: this.multiSelectData,
                    },
                  },
                ],
              },
            },
            column: 12,
          }),
          this.formService.addComponent({
            componentControl: {
              component: GridpaginationComponent,
              data: {
                hasExternalCols: true,
                lookUpColumns: [
                  {
                    field: 'CId',
                    header: 'Id',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'CFirstName',
                    header: 'FirstName',
                    filter: {
                      type: GridFilterControlType.DROPDOWN,
                      data: this.dropdownData,
                    },
                  },
                  {
                    field: 'LastName',
                    header: 'LastName',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'Age',
                    header: 'Age',
                    type: EGridColumnType.NUMERIC,
                    filter: {
                      type: GridFilterControlType.MULTISELECT,
                      data: this.multiSelectData,
                    },
                  },
                ],
              },
            },
            column: 12,
          }),
        ],
      },
      {
        name: 'Lead Information 02',
        icon: 'pi pi-fw pi-user-plus',
        accordionDisabled: false,
        showAccordion: true,
        fields: [
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: {
                hasExternalCols: true,
                lookUpColumns: [
                  {
                    field: 'CId',
                    header: 'Id',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'CFirstName',
                    header: 'FirstName',
                    filter: {
                      type: GridFilterControlType.DROPDOWN,
                      data: this.dropdownData,
                    },
                  },
                ],
              },
            },
            column: 12,
          }),
        ],
      },
      {
        name: 'Lead Information 03',
        icon: 'pi pi-fw pi-user-plus',
        accordionDisabled: false,
        showAccordion: true,
        fields: [
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: {
                hasExternalCols: true,
                lookUpColumns: [
                  {
                    field: 'CId',
                    header: 'Id',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'CFirstName',
                    header: 'FirstName',
                    filter: {
                      type: GridFilterControlType.DROPDOWN,
                      data: this.dropdownData,
                    },
                  },
                  {
                    field: 'LastName',
                    header: 'LastName',
                    filter: { type: GridFilterControlType.INPUT },
                  },
                  {
                    field: 'Age',
                    header: 'Age',
                    type: EGridColumnType.NUMERIC,
                    filter: {
                      type: GridFilterControlType.MULTISELECT,
                      data: this.multiSelectData,
                    },
                  },
                ],
              },
            },
            column: 12,
          }),
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: { accountId: '' },
            },
            column: 12,
          }),
        ],
      },
      {
        name: 'Sales Revenue 04',
        icon: 'pi pi-fw pi-money-bill',
        accordionDisabled: false,
        showAccordion: true,
        fields: [
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: { accountId: '' },
            },
            column: 12,
          }),
          this.formService.addComponent({
            componentControl: {
              component: GridclientsidepaginationComponent,
              data: { contactId: 'Hello World' },
            },
            column: 12,
          }),
        ],
      },
    ],
  };

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private formService: FormService,
    private dropdownService: DropdownService,
    private route: ActivatedRoute,
    public router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.users = [];

    // in case of displaying form in modal popup
    if (this.config) {
      this.isFromModal = true;
      if (this.config.data && this.config.data.id) {
        this.id = this.config.data.id.toString();
      }
    }

    // fetch street numbers from api to populate in dropdown
    this.loadStreetNumbers();

    // in case of getting id for edit from "modal popup config"
    if (this.id && this.id.length > 0) {
      this.loadDataForEdit();
    } else {
      // in case of getting id for edit from "query param"
      this.route.queryParams.subscribe((params: Params) => {
        if (params.id) {
          this.id = params.id;
          this.loadDataForEdit();
        }
      });
    }
  }

  loadDataForEdit() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-Query-SelectAll',
        filters: [
          {
            field: 'CId',
            matchMode: 'equals',
            operator: 'and',
            value: this.id,
          },
        ],
      })
      .subscribe(
        (data) => {
          if (data.records && data.records.length > 0) {
            for (const [key, value] of Object.entries(data.records[0])) {
              this.dynamicForm.formSections.forEach((section) => {
                section.fields.forEach((item) => {
                  if (item.field?.toLowerCase() === key?.toLowerCase()) {
                    if (item.control === EFormControl.CALENDAR) {
                      item.value = new Date(value as string);
                    } else {
                      item.value = value;
                    }
                  }
                });
              });
            }
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  /**
   * Fetch and set street numbers from api to populate in dropdown
   */
  loadStreetNumbers() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-GetStreetNumbers-StoredProcedure',
      })
      .subscribe(
        (response) => {
          this.streetNumbers.push(
            ...this.dropdownService.setDropDown(response, 'Id', 'StreetNumber')
          );
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  saveForm(formSections: IFormSection[]) {
    console.log('formSections', formSections);
    console.log('invoked save form event');

    const values = {};
    let uniqueKey: string = 'Customer-InsertStoredProcedure';

    // prepare values dictionary object
    formSections.forEach((formSection) => {
      formSection.fields.forEach((field) => {
        values[field.field] = field.value;
      });
    });

    // in case of update
    if (this.id && this.id.length > 0) {
      uniqueKey = 'Customer-UpdateStoredProcedure';
      values['Id'] = this.id;
    }

    this.requestService
      .get<any[], any>('/Data/Save', {
        uniqueKey: uniqueKey,
        values: values,
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
    console.log('fields:', fields);
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
