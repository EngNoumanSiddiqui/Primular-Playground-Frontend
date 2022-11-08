import { Component, OnInit } from '@angular/core';
import {
  EFormControl,
  ESelectFileType,
  IDynamicForm,
} from '../../models/form.model';
import {
  EHyperlink,
  EValidator,
  IFormField,
  ISelectItem,
} from 'src/app/models';
import { FormService } from 'src/app/services/form.service';
import * as utilities from '@churchillliving/se-ui-toolkit';
import { SelectionComponent } from '../grid-selection/selection.component';
import { RequestService } from 'src/app/services/request.service';
import { AlertService } from 'src/app/services/alert.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { DialogService } from 'primeng/dynamicdialog';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { GridpaginationComponent } from '../grid-pagination/grid-pagination.component';
import { EFormatType } from '@churchillliving/se-ui-toolkit';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-muliti-fetch-form',
  templateUrl: './muliti-fetch-form.component.html',
})
export class MulitiFetchFormComponent implements OnInit {
  streetNumbers: ISelectItem[] = [];
  isFromModal = false;
  id: any = '';
  data: string[] = [];
  firstName: any;
  lastName: any;
  fetchForm: IDynamicForm;
  imageSource: any;

  constructor(
    private formService: FormService,
    private requestService: RequestService,
    private alertService: AlertService,
    private dropdownService: DropdownService,
    private dialogService: DialogService
  ) {
    this.loadStreetNumbers();
  }

  ngOnInit(): void {
    this.getAllFiles();
    this.initilizaForm();
    this.loadDataForEdit();
  }

  async initilizaForm() {
    this.fetchForm = {
      formSections: [
        {
          name: '',
          fields: [
            // {
            //   label: 'First Name',
            //   field: 'FirstName',
            //   control: EFormControl.INPUT,
            //   value: '',
            //   tables: ['Customer'],
            // },
            this.formService.addCalendar({
              field: 'LEASESTART',
              //label: 'Lease Start',
              label: {
                disabled: false,
                name: 'Lease Start',
                labelControl: await this.formService.addDialog({
                  lookupControl: {
                    component: SelectionComponent,
                    data: {
                      header: 'Lease Start History',
                      width: '40%',
                      data: { pkvalue: '', tablename: 'LFLEASESTART' },
                    },
                  },
                }),
              },
              tables: ['LFOPPORT'],
              format: { type: EFormatType.SHORTDATE },
              disabled: false,
            }),
            this.formService.addDropdown({
              field: 'FURNITURE',
              //label: "Furnished By",
              label: {
                name: 'Furnished By',
                labelControl: await this.formService.addHyperlink({
                  hyperlink: {
                    target: EHyperlink.BLANK,
                    linkId: 'suithold',
                    params: {
                      BLDGID: '',
                    },
                  },
                }),
                // onClick: () => {
                //   console.log('on click invoked');
                // },
              },
              optionLabel: 'label',
              optionValue: 'value',
              data: [
                { label: 'Churchill', value: 'Churchill' },
                { label: 'Landlord', value: 'Landlord' },
                { label: 'Rental', value: 'Rental' },
                {
                  label: 'Corporate Housing Provider',
                  value: 'CHP',
                },
              ],
              tables: ['Suite'],
              onFocusOut: function (formField: IFormField) {
                console.log('OnfocusOut');
              },
            }),

            this.formService.addTextbox({
              field: 'ACCOUNTREP',
              onClick: () => {
                console.log('addTextbox on click invoked');
              },
              label: {
                name: 'Acct Exec',

                labelControl: await this.formService.addHyperlink({
                  hyperlink: {
                    target: EHyperlink.BLANK,
                    linkId: 'AcctExec',
                    params: { AccountId: '' },
                  },
                }),
              },
              validations: [],
              tables: ['Calc'],
            }),

            this.formService.addLookUp({
              tables: ['CONTACT'],
              field: 'cFirstName',
              displayField: 'ACCOUNTNAME',
              onClick: () => {
                console.log('addLookUp on click invoked');
              },
              label: {
                disabled: true,
                name: 'Primary Company',
                labelControl: await this.formService.addDialog({
                  lookupControl: {
                    component: SelectionComponent,
                    data: {
                      header: 'Account Selection',
                      width: '80%',
                      matchValue: 'cFirstName',
                      matchField: 'age',
                      data: { accountId: '000000018451' },
                    },
                  },
                }),
                onReturn: function (res) {
                  console.log('Label onReturn', res);
                },
              },
              lookupControl: {
                component: FormComponent,
                data: {
                  header: 'Account Selection',
                  width: '80%',
                  // matchValue: 'cFirstName',
                  // matchField: 'age',
                  data: { accountId: '10001' },
                },
              },
              onFocusOut: function (formFeild: IFormField) {
                console.log('onFocusOut', formFeild);
              },
              onReturn: function (res) {
                console.log('Label onReturn', res);
              },
            }),
            this.formService.addDisplayFile({
              label: 'Last Name',
              field: 'LastName',
              value: '',
              control: EFormControl.DISPLAY_FILE,
              tables: ['Customer'],
              data: this.imageSource,
              column: 12,
            }),
            // {
            //   label: 'Last Name',
            //   field: 'LastName',
            //   value: '',
            //   control: EFormControl.DISPLAY_FILE,
            //   tables: ['Customer'],
            //   data: this.imageSource,
            //   column: 12
            // },
            {
              label: 'Age',
              field: 'Age',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Customer'],
            },
            {
              label: 'Created Date',
              field: 'CreatedDate',
              value: '',
              control: EFormControl.CALENDAR,
              tables: ['Customer'],
            },
            {
              label: 'Active',
              field: 'Active',
              value: null,
              control: EFormControl.CHECKBOX,
              tables: ['Customer'],
            },
            {
              label: 'Email',
              field: 'Email',
              value: '',
              control: EFormControl.INPUT,
              tables: ['Customer'],
            },
            {
              label: 'Modified Date',
              field: 'ModifiedDate',
              value: '',
              control: EFormControl.CALENDAR,
              tables: ['Customer'],
            },
            {
              label: 'Serial Number',
              field: 'SerialNumber',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Customer'],
            },
            {
              label: 'Has Orders',
              field: 'HasOrders',
              value: null,
              control: EFormControl.CHECKBOX,
              tables: ['Customer'],
            },
            {
              label: 'Street Number',
              field: 'StreetNumber',
              value: null,
              control: EFormControl.DROPDOWN,
              data: this.streetNumbers,
              tables: ['Customer'],
            },
            {
              label: 'Total Orders',
              field: 'TotalOrders',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Customer'],
            },
            {
              label: 'Building Notes',
              field: 'Notes',
              value: '',
              control: EFormControl.NOTE_FIELD,
              tables: ['Customer'],
              onReturn(note) {
                this.value = note;
              },
            },
            {
              label: 'Total',
              field: 'Total',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Order'],
            },

            this.formService.addLookUp({
              field: 'firstname',
              //label: 'FirstName',
              tables: ['Customer'],
              displayField: 'CustomerId',
              label: {
                name: 'FirstName',
                onClick: () => {
                  this.dialogService.open(GridViewComponent, {
                    header: 'Suite Reasons',
                    width: '100%',
                  });
                },
                // labelControl: await this.formService.addHyperlink({
                //   hyperlink: {
                //     target: EHyperlink.PARENT,
                //     link: 'http://www.google.com',
                //     linkId: 'suithold',
                //     params: {
                //       LASTNAME: '',
                //       Age: '',
                //       SerialNumber: '',
                //       suitId: '',
                //     },
                //   },
                // }),
              },
              // value: 'Test13', // value that will be set as selected in row selection
              lookupControl: {
                component: SelectionComponent,
                data: {
                  header: 'Grid selection',
                  width: '80%',
                  matchField: 'CFirstName', // field that will be used for row selection
                  data: { value: '11' },
                },
              },
              validations: [
                { type: EValidator.REQUIRED, expression: '' },
                { type: EValidator.MINLENGTH, expression: 6 },
                { type: EValidator.MAXLENGTH, expression: 15 },
              ],
              onFocusOut: function (formField: IFormField) {
                console.log('onFocusOut:', formField);
                console.log('onFocusOut-2:', formField.value);
              },
            }),
          ],
        },
      ],
    };
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
    this.requestService
      .get<any[], any>('/Data/BulkFetch', [
        {
          uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
          filters: [
            {
              field: 'Id',
              matchMode: 'equals',
              operator: 'and',
              value: '70',
            },
          ],
          sorts: [],
          pageSize: 0,
          page: 0,
        },
        {
          uniqueKey: 'Order-Query-SelectAllWithoutAliases',
          filters: [
            {
              field: 'Id',
              matchMode: 'equals',
              operator: 'and',
              value: '10',
            },
          ],
          sorts: [],
          pageSize: 0,
          page: 0,
        },
      ])
      .subscribe(
        (response: any) => {
          console.log('data', response);
          // response.forEach((obj) => {
          //   for (const [key, value] of Object.entries(obj.records[0])) {
          //     this.fetchForm.formSections.forEach((section) => {
          //       section.fields.forEach((field) => {
          //         if (field.field?.toLowerCase() === key?.toLowerCase()) {
          //           if (field.control === EFormControl.CALENDAR) {
          //             field.value = new Date(value as string);
          //           } else {
          //             field.value = value;
          //           }
          //         }
          //       });
          //     });
          //   }
          // });

          //utilities.setEditFormFields(response, this.fetchForm);

          this.firstName = utilities.getOrigDataFieldValue(
            response,
            'firstName'
          );
          this.lastName = utilities.getOrigDataFieldValue(response, 'lastName');
          console.log('this.firstName:', this.firstName);
          console.log('this.lastName:', this.lastName);
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
}
